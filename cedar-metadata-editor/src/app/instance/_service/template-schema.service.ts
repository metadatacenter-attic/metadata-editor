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

  isRequired(schema:TemplateSchema) {
    return schema._valueConstraints.requiredValue;
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

  getTitle(schema: TemplateSchema) {
    return schema['schema:name'];
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

}
