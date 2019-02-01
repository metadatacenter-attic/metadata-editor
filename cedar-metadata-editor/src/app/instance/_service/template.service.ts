import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Inject, Optional} from '@angular/core';

import {FileNode} from '../_models/file-node';
import {TemplateData} from '../_models/template-data';
import {InputTypes} from '../_models/input-types';


const FIELD_TYPES = JSON.stringify([
  {
    'cedarType': 'textfield',
    'iconClass': 'fa fa-font',
    'label': 'Text',
    'allowedInElement': true,
    'primaryField': true,
    'hasControlledTerms': true,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': true,
    'hasInstanceTerm': true,
    'allowsRequired': true
  },
  {
    'cedarType': 'link',
    'iconClass': 'fa fa-link',
    'label': 'link',
    'allowedInElement': true,
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': true,
    'allowsRequired': true
  },
  {
    'cedarType': 'textarea',
    'iconClass': 'fa fa-paragraph',
    'label': 'Text Area',
    'allowedInElement': true,
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'radio',
    'iconClass': 'fa fa-dot-circle-o',
    'label': 'Multiple Choice',
    'allowedInElement': true,
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'checkbox',
    'iconClass': 'fa fa-check-square-o',
    'label': 'Checkbox',
    'allowedInElement': true,
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'date',
    'iconClass': 'fa fa-calendar',
    'label': 'Date',
    'allowedInElement': true,
    'primaryField': true,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'email',
    'iconClass': 'fa fa-envelope',
    'label': 'Email',
    'allowedInElement': true,
    'primaryField': true,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'list',
    'iconClass': 'fa fa-list',
    'allowedInElement': true,
    'primaryField': false,
    'label': 'List',
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'numeric',
    'iconClass': 'fa fa-hashtag',
    'allowedInElement': true,
    'primaryField': true,
    'Label': 'Number',
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'phone-number',
    'iconClass': 'fa fa-th',
    'allowedInElement': true,
    'label': 'Phone Number',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': true,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': true
  },
  {
    'cedarType': 'attribute-value',
    'iconClass': 'fa fa-plus-square',
    'label': 'Attribute Value',
    'allowedInElement': true,
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': false,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  },
  {
    'cedarType': 'page-break',
    'iconClass': 'fa fa-file-o',
    'allowedInElement': false,
    'label': 'Page Break',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': true,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  },
  {
    'cedarType': 'section-break',
    'iconClass': 'fa fa-minus',
    'allowedInElement': true,
    'label': 'Section Break',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': true,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  },
  {
    'cedarType': 'richtext',
    'iconClass': 'fa fa-pencil-square-o',
    'allowedInElement': true,
    'label': 'Rich Text',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': true,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  },
  {
    'cedarType': 'image',
    'iconClass': 'fa fa-image',
    'allowedInElement': true,
    'label': 'Image',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': true,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  },
  {
    'cedarType': 'youtube',
    'iconClass': 'fa fa-youtube-square',
    'allowedInElement': true,
    'label': 'YouTube Video',
    'primaryField': false,
    'hasControlledTerms': false,
    'staticField': true,
    'allowsMultiple': false,
    'allowsValueRecommendation': false,
    'hasInstanceTerm': false,
    'allowsRequired': false
  }
]);
const specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^rdfs:)|(^oslc:)/i;

@Injectable()
export class TemplateService {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  model: object;
  template: object;
  fieldTypes: object;
  td: TemplateData;
  it: InputTypes;


  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor(@Inject('templateId') @Optional() public templateId?: string) {

    this.fieldTypes = JSON.parse(FIELD_TYPES);
    this.td = new TemplateData();
    this.it = new InputTypes();


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

  getInputType(schema) {
    return (schema && schema._ui && schema._ui.inputType) ? schema._ui.inputType : null;
  }

  isCheckboxField(inputType) {
    return inputType === 'checkbox';
  }

  isTextType(inputType) {
    return (inputType === 'textfield');
  }

  isLinkType(inputType) {
    return (inputType === 'link');
  }

  isNumericType(inputType) {
    return (inputType === 'numeric');
  }

  isAttributeValueType(inputType) {
    return (inputType === 'attribute-value');
  }

  isDateType(inputType) {
    return (inputType === 'date');
  }

  // has multiple choice value constraints?
  isMultiValue(schema) {
    return schema._valueConstraints && schema._valueConstraints.multipleChoice;
  }

  isStaticField = inputType => {
    return this.it.config[inputType].staticField;
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
  }

  isSpecialKey(key) {
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
  getFieldControlledTerms(schema, inputType) {
    if (!this.isStaticField(inputType) && !this.isAttributeValueType(inputType)) {
      const properties = this.propertiesOf(schema);
      if (properties['@type'] && properties['@type'].oneOf && properties['@type'].oneOf[1]) {
        return properties['@type'].oneOf[1].items['enum'];
      }
    }
  }

  // where is the value of this field, @id or @value?
  getValueLocation(schema, inputType) {
    const ct = this.getFieldControlledTerms(schema, inputType);
    const ctv = this.hasControlledTermValue(schema);
    const link = this.isLinkType(inputType);
    return (ct || ctv || link) ? '@id' : '@value';
  }

  hasUserDefinedDefaultValue(schema) {
    return schema._valueConstraints && schema._valueConstraints.defaultValue;
  }

  getUserDefinedDefaultValue(schema) {
    return schema._valueConstraints.defaultValue;
  }

  getDefaultValue(value, schema, inputType, valueLocation) {
    if (valueLocation === '@value') {
      // If the template contains a user-defined default value, we use it as the default value for the field
      if (this.isTextType(inputType) && this.hasUserDefinedDefaultValue(schema)) {
        return this.getUserDefinedDefaultValue(schema);
      }
      if (this.isAttributeValueType(inputType)) {
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
  initializeValue(value, schema, inputType, model) {

    if (!this.isAttributeValueType(inputType)) {

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
  initializeValueType(value, schema, inputType, model) {
    let fieldType;
    if (this.isNumericType(inputType)) {
      fieldType = this.generateInstanceTypeForNumericField(schema);
    } else if (this.isDateType(inputType)) {
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

  isCheckboxListRadioType(inputType) {
    return ((inputType === 'checkbox') || (inputType === 'radio') || (inputType === 'list'));
  }

  // is this a radio, or a single-choice list?
  isSingleChoice(schema, inputType) {
    return ((inputType === 'radio') || ((inputType === 'list') && !this.isMultiValue(schema)));
  }

  // get the value constraint literal values
  getLiterals(schema) {
    if (schema._valueConstraints) {
      return schema._valueConstraints.literals;
    }
  }

  defaultOptionsToModel(value, schema, inputType, model) {
    if (this.isCheckboxListRadioType(inputType)) {
      const literals = this.getLiterals(schema);
      const valueLocation = this.getValueLocation(schema, inputType);
      // Checkbox or multi-choice  list
      if ((this.isCheckboxField(inputType) || this.isMultiValue(schema))) {
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
    if (!this.isStaticField(inputType)) {

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
          model[key] = (this.isCheckboxField(inputType) || this.isMultiValue(schema)) ? [] : {};
        }

        // Set default values and types for fields
        this.initializeValue(value, schema, inputType, model[key]);
        // Initialize value type for those fields that have it
        if (this.isTextType(inputType) || this.isDateType(inputType) || this.isNumericType(inputType)) {
          this.initializeValueType(value, schema, inputType, model[key]);
        }
        if (this.isAttributeValueType(inputType)) {
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
      console.log('initialize', formGroup, templateId);
    if (templateId === '1') {
      this.template = this.td.templateData[1];
      this.model = this.td.modelData[1];
    } else {
      this.template = this.td.templateData[0];
      this.model = this.td.modelData[0];
    }
    console.log('this.template[properties]', this.template['properties']);
    const data = this.buildFileTree(this.template['properties'], this.model, 0, formGroup, null);
    console.log('data', data);
    this.dataChange.next(data);
  }

  getValues(schema, inputType, modelValue) {
    const result = {'values': ['one', 'two']};
    const valueLocation = this.getValueLocation(schema, inputType);
    console.log('isArray', Array.isArray(modelValue), 'modelValue', modelValue, 'valueLocation', valueLocation);
    return result;
  }

  buildFileTree(obj: { [key: string]: any }, model: any, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    console.log('object', obj, 'model', model);
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {

      const special = this.isSpecialKey(key);
      const value = obj[key];

      const node = new FileNode();

      if (!special) {

        const schema = this.schemaOf(value);
        const modelValue = model[key];
        const inputType = this.getInputType(schema);


        node.key = key;
        node.name = this.getTitle(schema);
        node.formGroup = formGroup;
        node.parentGroup = parent ? parent.formGroup : null;
        node.parent = parent;

        if (value['minItems'] || value['maxItems']) {
          node.minItems = value['minItems'];
          node.maxItems = value['maxItems'];
          node.itemCount = value['itemCount'];
        }
        if (this.isElement(schema)) {
          console.log('isElement');
          node.parentGroup = node.formGroup;
          node.formGroup = new FormGroup({});
          if (schema.properties) {
            node.children = this.buildFileTree(schema.properties, modelValue,level + 1, node.formGroup, node);
          } else {
            console.log('error');
          }
        }
        if (this.isField(schema)) {
          console.log('isField');

          node.type = 'textfield';
          node.subtype = inputType;
          node.min = 0;
          node.max = 2;
          node.options = null;

          node.value = this.getValues(schema, inputType, modelValue);

          node.help = 'help text';
          node.required = false;
          node.hint = 'hint text';
        }
      }

      return (special ? accumulator : accumulator.concat(node));

    }, []);
  }


}
