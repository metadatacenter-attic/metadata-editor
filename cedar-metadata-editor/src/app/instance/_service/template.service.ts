import {Inject, Injectable, Optional} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {FileNode} from '../_models/file-node';
import {TemplateDataService} from '../_service/template-data.service';
import {InputType, InputTypeService} from '../_models/input-types';
import {TemplateSchema} from '../_models/template-schema';
import {TemplateSchemaService} from '../_service/template-schema.service';


@Injectable()
export class TemplateService {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  model: object;
  template: object;

  td: TemplateDataService;
  it: InputTypeService;
  ts: TemplateSchemaService;


  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor(@Inject('templateId') @Optional() public templateId?: string) {
    this.td = new TemplateDataService();
    this.it = new InputTypeService();
    this.ts = new TemplateSchemaService();
  }

  getTitle() {
    return this.template ? this.template['schema:name'] : '';
  }


  isType(key) {
    return (key === '@type');
  }

  isContext(key) {
    return (key === '@context');
  }

  isAttributeValue(schema: TemplateSchema) {
    return this.ts.getInputType(schema) === InputType.attributeValue;
  }


  /* create the context  */
  setContext(schema: TemplateSchema, model) {

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
    const properties = this.ts.propertiesOf(schema);
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
    const instanceType = this.ts.generateInstanceType(value);
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
  hasControlledTermValue(schema: TemplateSchema) {
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
  getFieldControlledTerms(schema: TemplateSchema, inputType: InputType) {
    if (!this.it.isStatic(inputType) && inputType !== InputType.attributeValue) {
      const properties = this.ts.propertiesOf(schema);
      if (properties['@type'] && properties['@type'].oneOf && properties['@type'].oneOf[1]) {
        return properties['@type'].oneOf[1].items['enum'];
      }
    }
  }

  // where is the value of this field, @id or @value?
  getValueLocation(schema: TemplateSchema, inputType: InputType) {
    const ct = this.getFieldControlledTerms(schema, inputType);
    const ctv = this.hasControlledTermValue(schema);
    const link = inputType === InputType.link;
    return (ct || ctv || link) ? '@id' : '@value';
  }

  hasUserDefinedDefaultValue(schema: TemplateSchema) {
    return schema._valueConstraints && schema._valueConstraints.defaultValue;
  }

  getUserDefinedDefaultValue(schema: TemplateSchema) {
    return schema._valueConstraints.defaultValue;
  }

  getDefaultValue(value, schema: TemplateSchema, inputType: InputType, valueLocation) {
    if (valueLocation === '@value') {
      // If the template contains a user-defined default value, we use it as the default value for the field
      if (inputType === InputType.textfield && this.hasUserDefinedDefaultValue(schema)) {
        return this.getUserDefinedDefaultValue(schema);
      }
      if (inputType === InputType.attributeValue) {
        return this.ts.getTitle(schema);
      } else {
        return null;
      }
    }
    // Otherwise don't return anything because the @id field can't be initialized to null
  }


  // This function initializes the @value field (in the model) to null if it has not been initialized yet.
  // For text fields, it may also set it to a default value set by the user when creating the template. Note that
  // the @id field can't be initialized to null. In JSON-LD, @id must be a string, so we don't initialize it.
  initializeValue(value, schema: TemplateSchema, inputType: InputType, model) {

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
            if ((this.ts.isUndefined(modelValue)) || (modelValue && (modelValue.length === 0))) {
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
  initializeValueType(value, schema: TemplateSchema, inputType: InputType, model) {
    let fieldType;
    if (inputType === InputType.numeric) {
      fieldType = this.ts.generateInstanceTypeForNumericField(schema);
    } else if (inputType === InputType.date) {
      fieldType = this.ts.generateInstanceTypeForDateField();
    } else {
      const properties = this.ts.propertiesOf(schema);
      if (properties && !this.ts.isUndefined(properties['@type'])) {
        fieldType = this.ts.generateInstanceType(properties['@type']);
      }
    }
    if (fieldType) {
      // It is not an array
      if (value.type === 'object') {
        // If the @type has not been defined yet, define it
        if (this.ts.isUndefined(model['@type'])) {
          // No need to set the type if it is xsd:string. It is the type by default
          if (fieldType !== 'xsd:string') {
            model['@type'] = fieldType;
          }
        }
      } else if (value.type === 'array') {
        for (let i = 0; i < model.length; i++) {
          // If there is an item in the array for which the @type has not been defined, define it
          if (this.ts.isUndefined(model[i]['@type'])) {
            // No need to set the type if it is xsd:string. It is the type by default
            if (fieldType !== 'xsd:string') {
              model[i]['@type'] = fieldType;
            }
          }
        }
      }
    }
  }

  isCheckboxListRadioType(inputType: InputType) {
    return ((inputType === InputType.checkbox) || (inputType === InputType.radio) || (inputType === InputType.list));
  }

  // is this a radio, or a single-choice list?
  isSingleChoice(schema, inputType: InputType) {
    return ((inputType === InputType.radio) || ((inputType === InputType.list) && !this.ts.isMultiValue(schema)));
  }

  defaultOptionsToModel(value, schema: TemplateSchema, inputType: InputType, model) {
    if (this.isCheckboxListRadioType(inputType)) {
      const literals = this.ts.getLiterals(schema);
      const valueLocation = this.getValueLocation(schema, inputType);
      // Checkbox or multi-choice  list
      if ((inputType === InputType.checkbox || this.ts.isMultiValue(schema))) {
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

  parseElement(value: object, schema: TemplateSchema, key: string, minItems: number, model: object) {
    const properties = this.ts.propertiesOf(schema);

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

  parseField(value: object, schema: TemplateSchema, key: string, minItems: number, model: object) {

    const inputType = this.ts.getInputType(schema);
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
          model[key] = (inputType === InputType.checkbox || this.ts.isMultiValue(schema)) ? [] : {};
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
      const schema = this.ts.schemaOf(value);

      if (this.isSpecialKey(key)) {
        if (this.isContext(key)) {
          this.setContext(schema, model);
        } else if (this.isType(key)) {
          this.setType(value, model);
        }
      } else {
        if (this.ts.isElement(schema)) {
          this.parseElement(value, schema, key, minItems, model);
        } else if (this.ts.isField(schema)) {
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


    const data = this.buildFileTree(this.template['_ui']['order'], this.template['properties'], model, 0, this.formGroup, null);
    this.dataChange.next(data);
    console.log('buildFileTree', data, this.formGroup);
  }

  /* build the tree of FileNodes*/
  initialize(formGroup: FormGroup, templateId: string): any {
    const id = Number.parseInt(templateId);
    this.template = this.td.templateData[id];
    this.model = this.td.modelData[id];
    const data = this.buildFileTree(this.template['_ui']['order'], this.template['properties'], this.model, 0, formGroup, null);
    this.dataChange.next(data);
    return this.model;
  }

  getListSingleValue(literals, label): number {
    return literals
      .map(function (element) {
        return element.label;
      })
      .indexOf(label);
  }

  getListMultipleValue(literals, values, valueLocation): string[] {
    let result = [];

    let literal = literals
      .map(function (literal) {
          return literal.label;
        }
      );

    let r = [];
    for (let i = 0; i < values.length; i++) {
      r.push(values[i][valueLocation]);
    }
    result.push(r);

    console.log('getListMultipleValue', literals, values, valueLocation, result)
    return result;
  }

  getRadioValue(literals, label): number {
    return literals
      .map(function (element) {
        return element.label;
      })
      .indexOf(label);
  }

  getCheckValue(values, valueLocation): string[] {
    let result = [];
    for (let i = 0; i < values.length; i++) {
      result.push(values[i][valueLocation]);
    }
    return result;
  }

  getTextValue(values, valueLocation): string[] {

    let val = values;
    if (Array.isArray(values) && Array.isArray(values[0])) {
      val = values[0]
    }

    let result = [];
    for (let i = 0; i < val.length; i++) {
      result.push(val[i][valueLocation]);
    }
    return result;
  }


  getDateValue(values, valueLocation): Date[] {
    let val = values;
    if (Array.isArray(values) && Array.isArray(values[0])) {
      val = values[0]
    }
    let result = []
    for (let i = 0; i < val.length; i++) {
      // 'add' a timezone offset so we end up on the original date again
      let dt = new Date(val[i][valueLocation]);
      dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
      result.push(dt);
    }
    return result;
  }

  getControlledValue(values, valueLocation): string[] {
    let result = [];
    for (let i = 0; i < values.length; i++) {
      result.push(values[i][valueLocation]);
    }
    return result;
  }

  getControlledLabel(labels, labelLocation): string[] {
    let result = [];
    for (let i = 0; i < labels.length; i++) {
      result.push(labels[i][labelLocation]);
    }
    return result;
  }

  getValues(schema: TemplateSchema, inputType: InputType, modelValue): any[] {

    let result = [];
    const valueLocation = this.getValueLocation(schema, inputType);
    const literals = this.ts.getLiterals(schema);

    switch (inputType) {
      case InputType.controlled:
        result = this.getControlledValue(modelValue, '@id');
        break;
      case InputType.checkbox:
        result.push(this.getCheckValue(modelValue, valueLocation));
        break;
      case InputType.radio:
        result.push(this.getRadioValue(modelValue, valueLocation));
        break;
      case InputType.date:
        result = this.getDateValue(modelValue, valueLocation);
        break;
      case InputType.list:
        if (this.ts.isMultiValue(schema)) {
          result = this.getListMultipleValue(literals, modelValue, valueLocation);
        } else {
          result.push(this.getListSingleValue(literals, modelValue));
        }
        break;
      case InputType.textfield:
      case InputType.email:
      case InputType.link:
      case InputType.phoneNumber:
      case InputType.textarea:
      case InputType.numeric:
        result.push(this.getTextValue(modelValue, valueLocation));
        break;
      default:
        console.log(inputType)


    }

    return result;
  }

  getLabels(schema: TemplateSchema, inputType: InputType, modelValue): any[] {
    let result = [];
    if (this.it.isControlled(inputType)) {
      result = this.getControlledLabel(modelValue, 'rdfs:label');
    }
    return result;
  }

  getOptions(schema: TemplateSchema, inputType: InputType, modelValue) {
    let options: any[] = [];
    if (this.it.isRadioCheckList(inputType)) {
      const literals = this.ts.getLiterals(schema);
      for (let i = 0; i < literals.length; i++) {
        let val: any = literals[i];
        let obj = {};
        obj['label'] = val.label;
        obj['value'] = i;
        options.push(obj);
      }
    }
    return options;
  }

  getNodeType(inputType: InputType): InputType {
    return this.it.isNotTextInput(inputType) ? inputType : InputType.textfield;
  }

  getSubtype(inputType) {
    return this.it.isNotTextInput(inputType) ? '' : inputType;
  }

  fieldNode(schema: TemplateSchema, model: any, inputType: InputType, minItems, maxItems, key, modelValue, formGroup: FormGroup, parent: FileNode): FileNode {

    const node = {
      'key': key,
      'model': model,
      'valueLocation': this.getValueLocation(schema, inputType),
      'name': this.ts.getTitle(schema),
      'type': this.getNodeType(inputType),
      'subtype': this.getSubtype(inputType),
      'minItems': minItems,
      'maxItems': maxItems,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'min': this.ts.getMin(schema),
      'max': this.ts.getMax(schema),
      'decimals': this.ts.getDecimals(schema),
      'minLength': this.ts.getMinStringLength(schema),
      'maxLength': this.ts.getMaxStringLength(schema),
      'value': this.getValues(schema, inputType, modelValue),
      'label': this.getLabels(schema, inputType, modelValue),
      'options': this.getOptions(schema, inputType, modelValue),
      'multipleChoice': this.ts.isMultiValue(schema),
      'required': this.ts.isRequired(schema),
      'help': this.ts.getHelp(schema),
      'placeholder': this.ts.getPlaceholder(schema),
      'hint': this.ts.getHint(schema)
    };
    return node;
  }

// generate a node for each element instance
  elementNode(schema: TemplateSchema, model: any, minItems, maxItems, i, key, level, modelValue, formGroup: FormGroup, parent: FileNode): FileNode {
    const node = {
      'key': key,
      'model': model,
      'name': this.ts.getTitle(schema),
      'help': this.ts.getHelp(schema),
      'placeholder': this.ts.getPlaceholder(schema),
      'hint': this.ts.getHint(schema),
      'minItems': minItems,
      'maxItems': maxItems,
      'itemCount': i,
      'parent': parent,
      'parentGroup': parent ? parent.formGroup : null,
      'formGroup': new FormGroup({}),
    };
    formGroup.addControl(key + i, node.formGroup);
    if (schema.properties) {
      node['children'] = this.buildFileTree(schema['_ui']['order'], schema.properties, modelValue[i], level + 1, node.formGroup, node);
    }
    return node;
  }

  attributeValueNode(schema: TemplateSchema, model: any, key: string, modelValue: any, formGroup: FormGroup, parent: FileNode): FileNode {

    const node = {

      'min': this.ts.getMin(schema),
      'max': this.ts.getMax(schema),
      'required': this.ts.isRequired(schema),
      'key': key,
      'model': model,
      'valueLocation': '@value',
      'name': this.ts.getTitle(schema),
      'type': InputType.attributeValue,
      'subtype': InputType.attributeValue,
      'minItems': 1,
      'maxItems': 5,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'value': modelValue,
      'label': this.ts.getTitle(schema),
      'help': this.ts.getHelp(schema),
      'placeholder': this.ts.getPlaceholder(schema),
      'hint': this.ts.getHint(schema)
    };
    return node;
  }

  walkFileTree(order: string[], obj: { [key: string]: any }, model: any, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return order.reduce<FileNode[]>(
      function (accumulator, currentValue, currentIndex, array) {
        const key: string = currentValue;
        if (!this.isSpecialKey(key)) {
          const value = obj[key];
          const modelValue = model[key];
          const schema: TemplateSchema = this.ts.schemaOf(value);
          const maxItems = value['maxItems'];
          const minItems = value['minItems'] || 0;
          if (this.ts.isField(schema)) {
            const node = this.fieldNode(schema, this.ts.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          } else if (this.ts.isElement(schema)) {
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

  buildFileTree(order: string[], obj: { [key: string]: any }, model: any, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return order.reduce<FileNode[]>((accumulator, key) => {
      if (!this.isSpecialKey(key)) {
        const value = obj[key];
        const schema: TemplateSchema = this.ts.schemaOf(value);
        const modelValue = (model && model[key]) ? model[key] : [];

        const maxItems = value['maxItems'];
        const minItems = value['minItems'] || 0;
        const name = this.ts.getTitle(schema);
        if (this.ts.isField(schema)) {

          if (this.isAttributeValue(schema)) {
            const items = this.ts.buildAttributeValues(model, key);
            let node = this.attributeValueNode(schema, model, key, items, formGroup, parent);
            accumulator = accumulator.concat(node);

          } else {
            let node = this.fieldNode(schema, model, this.ts.getInputType(schema), minItems, maxItems, key, [modelValue], formGroup, parent);
            accumulator = accumulator.concat(node);
            console.log('node',modelValue,node.value)
          }
        }
        if (this.ts.isElement(schema)) {
          const itemCount = Array.isArray(modelValue) ? modelValue.length : 1;
          for (let i = 0; i < itemCount; i++) {
            let node = this.elementNode(schema, model, minItems, maxItems, i, key, level, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        }


      }
      return accumulator;

    }, []);
  }


}
