import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Inject, Optional} from '@angular/core';

import {FileNode} from '../_models/file-node';
import {TemplateData} from '../_models/template-data';
import {InputType, InputTypeService} from '../_models/input-types';


@Injectable()
export class TemplateService {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  model: object;
  template: object;
  td: TemplateData;
  it: InputTypeService;

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor(@Inject('templateId') @Optional() public templateId?: string) {
    this.td = new TemplateData();
    this.it = new InputTypeService();
  }


  /* parsing Template object */
  isUndefined(value) {
    return value === null || value === undefined;
  }

  schemaOf(node) {
    return (node && node.type === 'array' && node.items) ? node.items : node;
  }

  propertiesOf(schema) {
    return schema.properties;
  }

  getTitle(schema) {
    return schema['schema:name'];
  }

  isType(key) {
    return (key === '@type');
  }

  isContext(key) {
    return (key === '@context');
  }

  isElement(schema) {
    return (schema['@type'] === 'https://schema.metadatacenter.org/core/TemplateElement');
  }

  isField(schema) {
    return (schema['@type'] === 'https://schema.metadatacenter.org/core/TemplateField');
  }

  getInputType(schema):InputType {
    return (schema && schema._ui && schema._ui.inputType) ? schema._ui.inputType : null;
  }

  // has multiple choice value constraints?
  isMultiValue(schema) {
    return schema._valueConstraints && schema._valueConstraints.multipleChoice;
  }

  /* create the context  */
  setContext(schema, model) {

    /* set the enum value into the result */
    const setEnum = function (props, obj) {
      Object.keys(props).forEach((key: string) => {
        const value = props[key];
        if (value.enum) {
          obj[key] = value.enum[0];
        }
      });
    };

    const result = {};
    const properties = this.propertiesOf(schema);
    Object.keys(properties).forEach((key: string) => {
      const value = properties[key];
      if (value.type === 'object') {
        result[key] = {};
        setEnum(value.properties, result[key]);
      } else {
        if (value.enum) {
          result[key] = value.enum[0];
        }
      }
    });
    model['@context'] = result;
  }

  removeContext(model, key) {
    if (model && model['@context']) {
      delete model['@context'][key];
    }
  }

  setType = (value, model) => {
    const instanceType = this.generateInstanceType(value);
    if (instanceType) {
      model['@type'] = instanceType;
    }
  };

  isSpecialKey(key) {
    const specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^rdfs:)|(^oslc:)/i;
    return specialKeyPattern.test(key);
  }

  isArrayType(node) {
    return node.type === 'array';
  }

  // does this field have a value constraint?
  hasControlledTermValue(schema) {
    let result = false;
    const vcst = schema._valueConstraints;
    if (vcst) {
      const hasOntologies = vcst.ontologies && vcst.ontologies.length > 0;
      const hasValueSets = vcst.valueSets && vcst.valueSets.length > 0;
      const hasClasses = vcst.classes && vcst.classes.length > 0;
      const hasBranches = vcst.branches && vcst.branches.length > 0;
      result = hasOntologies || hasValueSets || hasClasses || hasBranches;
    }
    return result;
  }

  // get the controlled terms list for field types
  getFieldControlledTerms(schema, inputType:InputType) {
    if (!this.it.isStatic(inputType) && inputType !== InputType.attributeValue) {
      const properties = this.propertiesOf(schema);
      if (properties['@type'] && properties['@type'].oneOf && properties['@type'].oneOf[1]) {
        return properties['@type'].oneOf[1].items['enum'];
      }
    }
  }

  // where is the value of this field, @id or @value?
  getValueLocation(schema, inputType:InputType) {
    const ct = this.getFieldControlledTerms(schema, inputType);
    const ctv = this.hasControlledTermValue(schema);
    const link = inputType === InputType.link;
    return (ct || ctv || link) ? '@id' : '@value';
  }

  hasUserDefinedDefaultValue(schema) {
    return schema._valueConstraints && schema._valueConstraints.defaultValue;
  }

  getUserDefinedDefaultValue(schema) {
    return schema._valueConstraints.defaultValue;
  }

  getDefaultValue(value, schema, inputType:InputType, valueLocation) {
    if (valueLocation === '@value') {
      // If the template contains a user-defined default value, we use it as the default value for the field
      if (inputType === InputType.textfield && this.hasUserDefinedDefaultValue(schema)) {
        return this.getUserDefinedDefaultValue(schema);
      }
      if (inputType === InputType.attributeValue) {
        return this.getTitle(schema);
      } else {
        return null;
      }
    }
    // Otherwise don't return anything because the @id field can't be initialized to null
  }

  // Function that generates the @type for a field in an instance, based on the schema @type definition
  generateInstanceType(value) {
    const enumeration = this.isUndefined(value.oneOf) ? value.enum : value.oneOf[0].enum;

    // If the type is defined at the schema level
    if (!this.isUndefined(enumeration)) {
      // If only one type has been defined, it is returned
      const instanceType = (enumeration.length === 1) ? enumeration[0] : enumeration;
      if (instanceType) {
        return instanceType;
      }
    }
  }

  generateInstanceTypeForDateField() {
    return 'xsd:date';
  }

  generateInstanceTypeForNumericField(schema) {
    if (schema._valueConstraints.hasOwnProperty('numberType')) {
      return schema._valueConstraints.numberType;
    }
  }

  // This function initializes the @value field (in the model) to null if it has not been initialized yet.
  // For text fields, it may also set it to a default value set by the user when creating the template. Note that
  // the @id field can't be initialized to null. In JSON-LD, @id must be a string, so we don't initialize it.
  initializeValue(value, schema, inputType:InputType, model) {

    if (inputType !== InputType.attributeValue) {

      const valueLocation = this.getValueLocation(schema, inputType);
      const defaultValue = this.getDefaultValue(value, schema, inputType, valueLocation);
      if (valueLocation === '@value') {

        if (this.isArrayType(model)) {
          if (model.length === 0) {
            model.push({});
            model[0][valueLocation] = defaultValue;
          } else {
            for (let i = 0; i < model.length; i++) {
              this.initializeValue(value, schema, inputType, model[i]);
            }
          }
        } else {
          if (!model) {
            model = {};
          }
          // Value field has been defined
          if (model.hasOwnProperty(valueLocation)) {
            // If undefined value or empty string
            const modelValue = model[valueLocation];
            if ((this.isUndefined(modelValue)) || (modelValue && (modelValue.length === 0))) {
              model[valueLocation] = defaultValue;
            }
          } else {
            model[valueLocation] = defaultValue;
          }
        }
      }
    }
  }

  // Initializes the value @type field in the model based on the fieldType.
  // Note that for 'date' and 'numeric' fields, the field schema is flexible, allowing any string as a type.
  // Users may want to manually create instances that use different date or numeric types (e.g., xsd:integer).
  // As a consequence, we cannot use the @type definition from the schema to generate the @type for the instance
  // field. We 'manually' generate those types.
  initializeValueType(value, schema, inputType:InputType, model) {
    let fieldType;
    if (inputType === InputType.numeric) {
      fieldType = this.generateInstanceTypeForNumericField(schema);
    } else if (inputType === InputType.date) {
      fieldType = this.generateInstanceTypeForDateField();
    } else {
      const properties = this.propertiesOf(schema);
      if (properties && !this.isUndefined(properties['@type'])) {
        fieldType = this.generateInstanceType(properties['@type']);
      }
    }
    if (fieldType) {
      // It is not an array
      if (value.type === 'object') {
        // If the @type has not been defined yet, define it
        if (this.isUndefined(model['@type'])) {
          // No need to set the type if it is xsd:string. It is the type by default
          if (fieldType !== 'xsd:string') {
            model['@type'] = fieldType;
          }
        }
      } else if (value.type === 'array') {
        for (let i = 0; i < model.length; i++) {
          // If there is an item in the array for which the @type has not been defined, define it
          if (this.isUndefined(model[i]['@type'])) {
            // No need to set the type if it is xsd:string. It is the type by default
            if (fieldType !== 'xsd:string') {
              model[i]['@type'] = fieldType;
            }
          }
        }
      }
    }
  }

  isCheckboxListRadioType(inputType:InputType) {
    return ((inputType === InputType.checkbox) || (inputType === InputType.radio) || (inputType === InputType.list));
  }

  // is this a radio, or a single-choice list?
  isSingleChoice(schema, inputType:InputType) {
    return ((inputType === InputType.radio) || ((inputType === InputType.list) && !this.isMultiValue(schema)));
  }

  // get the value constraint literal values
  getLiterals(schema) {
    if (schema._valueConstraints) {
      return schema._valueConstraints.literals;
    }
  }

  defaultOptionsToModel(value, schema, inputType:InputType, model) {
    if (this.isCheckboxListRadioType(inputType)) {
      const literals = this.getLiterals(schema);
      const valueLocation = this.getValueLocation(schema, inputType);
      // Checkbox or multi-choice  list
      if ((inputType === InputType.checkbox || this.isMultiValue(schema))) {
        for (let i = 0; i < literals.length; i++) {
          if (literals[i].selectedByDefault) {
            const newValue = {};
            newValue[valueLocation] = literals[i].label;
            model.push(newValue);
          }
        }
      } else {
        if (this.isSingleChoice(schema, inputType)) {
          for (let i = 0; i < literals.length; i++) {
            if (literals[i].selectedByDefault) {
              model[valueLocation] = literals[i].label;
              break;
            }
          }
        }
      }
    }
  }

  parseElement(value: object, schema: object, key: string, minItems: number, model: object) {
    const properties = this.propertiesOf(schema);

    // Handle position and nesting within model if it does not exist
    if (this.isArrayType(value)) {
      model[key] = [];
      for (let i = 0; i < minItems; i++) {
        model[key].push({});
        this.parseForm(properties, model[key][i]);
      }
    } else {
      model[key] = {};
      this.parseForm(properties, model[key]);
    }
  }

  parseField(value: object, schema: object, key: string, minItems: number, model: object) {

    const inputType = this.getInputType(schema);
    if (!this.it.isStatic(inputType)) {

      // Assign empty field instance model to model only if it does not exist
      if (model[key] === undefined) {
        // is this a multi-instance field?
        if (this.isArrayType(value)) {
          model[key] = [];
          for (let i = 0; i < minItems; i++) {
            model[key].push({});
          }
        } else {
          // is this a multiple choice field (checkbox and multi-choice list) that stores an array of values?
          model[key] = (inputType === InputType.checkbox || this.isMultiValue(schema)) ? [] : {};
        }

        // Set default values and types for fields
        this.initializeValue(value, schema, inputType, model[key]);
        // Initialize value type for those fields that have it
        if (inputType === InputType.textfield || inputType === InputType.date || inputType === InputType.numeric) {
          this.initializeValueType(value, schema, inputType, model[key]);
        }
        if (inputType === InputType.attributeValue) {
          model[key] = [];
          // remove the @context entry for this attribute-value field
          this.removeContext(model, key);
        }
        this.defaultOptionsToModel(value, schema, inputType, model[key]);
      } else {
        console.log('Error: parentModel[key] !== undefined');
      }
    }

  }

  parseForm(properties: object, model: object) {

    Object.keys(properties).forEach((key: string) => {
      const value = properties[key];
      const minItems = value.minItems || 0;
      const schema = this.schemaOf(value);

      if (this.isSpecialKey(key)) {
        if (this.isContext(key)) {
          this.setContext(schema, model);
        } else if (this.isType(key)) {
          this.setType(value, model);
        }
      } else {
        if (this.isElement(schema)) {
          this.parseElement(value, schema, key, minItems, model);
        } else if (this.isField(schema)) {
          this.parseField(value, schema, key, minItems, model);
        }
      }
    });
  }

  startParseForm(model: object, template: object) {
    this.model = model;
    this.template = template;
    this.parseForm(this.template['properties'], this.model);
    console.log('startParseForm', model, template);


    const data = this.buildFileTree(this.template['properties'], model, 0, this.formGroup, null);
    this.dataChange.next(data);
    console.log('buildFileTree', data, this.formGroup);
  }

  /* build the tree of FileNodes*/
  initialize(formGroup: FormGroup, templateId: string) {

    if (templateId === '1') {
      this.template = this.td.templateData[0];
      this.model = this.td.modelData[0];
      const data = this.buildFileTree(this.template['properties'], this.model, 0, formGroup, null);
      this.dataChange.next(data);
    }
    if (templateId === '2') {
      this.template = this.td.templateData[1];
      this.model = this.td.modelData[1];
      const data = this.buildFileTree(this.template['properties'], this.model, 0, formGroup, null);
      this.dataChange.next(data);
    }
  }

  getRadioValue(literals, label): number {
    return literals
      .map(function (element) {
        return element.label;
      })
      .indexOf(label);
  }

  getListValue(literals, label): number {
    console.log('getListValue', literals, label);
    return literals
      .map(function (element) {
        return element.label;
      })
      .indexOf(label);
  }

  getCheckValue(literals, values, valueLocation): boolean[] {
    let result = [];

    let literal = literals
      .map(function (literal) {
          return literal.label;
        }
      );

    if (Array.isArray(values[0])) {
      for (let i = 0; i < values.length; i++) {
        let r = [];
        for (let j = 0; i < values[i].length; i++) {
          r.push(literal.indexOf(values[i][j][valueLocation]) > 0);
        }
        result.push(r);
      }
    } else {
      let r = [];
      for (let i = 0; i < values.length; i++) {
        r.push(literal.indexOf(values[i][valueLocation]) > 0);
      }
      result.push(r);
    }

    return result;
  }


  getValues(schema, inputType:InputType, modelValue) {
    const result = {'values': []};
    const valueLocation = this.getValueLocation(schema, inputType);

    if (modelValue) {
      if (Array.isArray(modelValue)) {
        if (this.it.isCheckbox(inputType)) {
          result.values = this.getCheckValue(schema._valueConstraints.literals, modelValue, valueLocation);
        } else {
          result.values = modelValue.map(value => {
            if (inputType === 'radio') {
              return this.getRadioValue(schema._valueConstraints.literals, value[valueLocation])
            } else {
              return value[valueLocation];
            }
          });
        }
      } else {
        if (modelValue.hasOwnProperty(valueLocation)) {
          if (this.it.isRadio(inputType)) {
            result.values.push(this.getRadioValue(schema._valueConstraints.literals, modelValue[valueLocation]))
          } else if (inputType === 'checkbox') {
            result.values.push(this.getCheckValue(schema._valueConstraints.literals, modelValue, valueLocation))
          } else {
            result.values.push(modelValue[valueLocation]);
          }
        } else {
          result.values.push(modelValue);
        }
      }
    }
    return result;
  }


  getOptions(schema, inputType:InputType, modelValue) {
    let options: any[] = [];
    if (this.it.isRadio(inputType) || this.it.isCheckbox(inputType) || this.it.isList(inputType)) {
      if (schema._valueConstraints && schema._valueConstraints.literals) {
        for (let i = 0; i < schema._valueConstraints.literals.length; i++) {
          let val: any = schema._valueConstraints.literals[i];
          let obj = {};
          obj['label'] = val.label;
          obj['value'] = i;
          options.push(obj);
        }
      }
    }
    return options;
  }


  getNodeType(inputType:InputType):InputType {
    return this.it.isNotTextInput(inputType) ? inputType : InputType.textfield;
  }

  getSubtype(inputType) {
    return this.it.isNotTextInput(inputType) ? '' : inputType;
  }

  fieldNode(schema, inputType:InputType, minItems, maxItems, key, modelValue, formGroup:FormGroup, parent:FileNode) {
    const node = new FileNode();
    node.minItems = minItems;
    node.maxItems = maxItems;
    node.itemCount = 0;
    node.key = key;
    node.name = this.getTitle(schema);
    node.formGroup = formGroup;
    node.parentGroup = parent ? parent.formGroup : null;
    node.parent = parent;
    node.type = this.getNodeType(inputType);
    node.subtype = this.getSubtype(inputType);
    node.min = 0;
    node.max = 2;
    node.value = this.getValues(schema, inputType, modelValue);
    node.options = this.getOptions(schema, inputType, modelValue);
    node.help = 'help text';
    node.required = false;
    node.hint = 'hint text';
    return node;
  }

// generate a node for each element instance
  elementNode(schema, minItems, maxItems, i, key, level, modelValue, formGroup:FormGroup, parent:FileNode) {
    const node = new FileNode();
    node.key = key;
    node.name = this.getTitle(schema);
    node.parent = parent;
    node.parentGroup = parent ? parent.formGroup : null;
    node.formGroup = new FormGroup({});
    formGroup.addControl(key+i, node.formGroup);
    node.minItems = minItems;
    node.maxItems = maxItems;
    node.itemCount = i;
    if (schema.properties) {
      node.children = this.buildFileTree(schema.properties, modelValue[i], level + 1, node.formGroup, node);
    }
    return node;
  }

  buildFileTree(obj: { [key: string]: any }, model: any, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {

      if (!this.isSpecialKey(key)) {
        const value = obj[key];
        const modelValue = model[key];
        const schema = this.schemaOf(value);
        const maxItems = value['maxItems'];
        const minItems = value['minItems'] || 0;
        if (this.isField(schema)) {
          const node = this.fieldNode(schema, this.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
          accumulator = accumulator.concat(node);
        } else if (this.isElement(schema)) {
          const itemCount = Array.isArray(modelValue) ? modelValue.length : 0;
          for (let i = 0; i < itemCount; i++) {
            const node = this.elementNode(schema, minItems, maxItems, i, key, level, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        }
      }
      return accumulator;

    }, []);
  }


}
