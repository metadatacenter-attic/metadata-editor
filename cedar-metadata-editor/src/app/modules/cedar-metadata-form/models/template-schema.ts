import {InputType} from "./input-type";


export interface SchemaProperties {
  'properties': { [key: string]: any }
}

export interface TemplateSchema {
  '@id': string,
  '@type': string,
  '@context': object
  'type': string,
  'title': string,
  'description': string,
  '_ui': {
    "pages": [],
    "order": string[],
    "propertyLabels": string[],
    "propertyDescriptions": string[],
    'inputType': InputType
  },
  "properties": SchemaProperties,
  "pav:version": string,
  "bibo:status": string,
  "$schema": string,
  '_valueConstraints'?: any;
}
