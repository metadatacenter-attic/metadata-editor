import {Injectable} from "@angular/core";

import {TemplateSchema} from '../_models/template-schema';
import {InputType} from "../_models/input-types";


@Injectable()
export class TemplateSchemaService {

  constructor() {
  }

  /* parsing Template object */
  isUndefined(value) {
    return value === null || value === undefined;
  }

  schemaOf(node): TemplateSchema {
    return (node && node.type === 'array' && node.items) ? node.items : node;
  }

  propertiesOf(schema: TemplateSchema) {
    return schema.properties;
  }

  // get the value constraint literal values
  getLiterals(schema: TemplateSchema) {
    if (schema._valueConstraints) {
      return schema._valueConstraints.literals;
    }
  }

  getHelp(schema:TemplateSchema) {
    return schema['schema:description'];
  }

  getPlaceholder(schema:TemplateSchema) {
    return 'placeholder text';
  }

  getHint(schema:TemplateSchema) {
    return 'hint text';
  }

  isRequired(schema:TemplateSchema) {
    return schema._valueConstraints && schema._valueConstraints.requiredValue;
  }

  getMin(schema:TemplateSchema) {
    return schema && schema._valueConstraints && schema._valueConstraints.minValue;
  }

  getMax(schema:TemplateSchema) {
    return schema && schema._valueConstraints && schema._valueConstraints.maxValue;
  }

  getDecimals(schema:TemplateSchema) {
    return schema && schema._valueConstraints && schema._valueConstraints.decimalPlace;
  }

  getMinStringLength(schema:TemplateSchema) {
    return schema && schema._valueConstraints && schema._valueConstraints.minLength;
  }

  getMaxStringLength(schema:TemplateSchema) {
    return schema && schema._valueConstraints && schema._valueConstraints.maxLength;
  }

  getMaxDefaultValue(schema:TemplateSchema) {
    return schema._valueConstraints.defaultValue;
  }

  getName(schema: TemplateSchema) {
    return schema['schema:name'];
  }

  getPrefLabel(schema:TemplateSchema) {
    return schema['skos:prefLabel'];
  }

  getTitle(schema:TemplateSchema) {
    return this.getPrefLabel(schema) || this.getName(schema);
  }

  isElement(schema: TemplateSchema) {
    return (schema['@type'] === 'https://schema.metadatacenter.org/core/TemplateElement');
  }

  isField(schema: TemplateSchema) {
    return (schema['@type'] === 'https://schema.metadatacenter.org/core/TemplateField');
  }

  getInputType(schema: TemplateSchema): InputType {
    return (schema && schema._ui && schema._ui.inputType) ? schema._ui.inputType : null;
  }

  // has multiple choice value constraints?
  isMultiValue(schema: TemplateSchema) {
    return schema._valueConstraints && schema._valueConstraints.multipleChoice;
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

  generateInstanceTypeForNumericField(schema: TemplateSchema) {
    if (schema._valueConstraints.hasOwnProperty('numberType')) {
      return schema._valueConstraints.numberType;
    }
  }

  setTextValue(model, key, index, valueLocation, val) {
    if (Array.isArray(model[key])) {
      model[key][index][valueLocation] = val;
    } else {
      model[key][valueLocation] = val;
    }
  }

  setRadioValue(model, key, index, valueLocation, val) {
    if (Array.isArray(model[key])) {
      model[key][index][valueLocation] = val;
    } else {
      model[key][valueLocation] = val;
    }
  }

  addControlledValue(model:any, key:string, value:string, label:string) {
    let val = {'@id' : value, 'rdfs:label' : label};
    model[key].push(val);
    console.log('setControlledValue', value, label, model[key]);
  }

  removeControlledValue(model:any, key:string, index:number) {
    model[key].splice(index, 1);
  }

  setCheckValue(model:any, key:string,  options, val) {
    let arr = [];
    for (const v in val) {
      arr.push({'@value': options[v].label})
    }
    model[key] = arr;
  }

  setDateValue(model:any, key:string, index:number, valueLocation, val) {
    let obj = Array.isArray(model[key]) ? model[key][index] :  model[key];
    obj[valueLocation] = val;
    obj['@type'] = 'xsd:date';
  }

}
