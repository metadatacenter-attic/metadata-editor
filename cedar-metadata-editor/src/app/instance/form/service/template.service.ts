import {Inject, Injectable, Optional} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {FileNode} from '../_models/file-node';
import {MetadataModel, MetadataSnip} from '../_models/metadata-model';
import {TemplateDataService} from './template-data.service';
import {InputType, InputTypeService} from '../_models/input-types';
import {TemplateSchema, SchemaProperties} from '../_models/template-schema';
import {TemplateSchemaService} from './template-schema.service';
import {Meta} from "@angular/platform-browser";
import {isNullOrUndefined} from "util";


@Injectable()
export class TemplateService {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  model: MetadataModel;
  template: TemplateSchema;

  td: TemplateDataService;
  it: InputTypeService;
  ts: TemplateSchemaService;

  constructor(@Inject('templateId') @Optional() public templateId?: string) {
    this.td = new TemplateDataService();
    this.it = new InputTypeService();
    this.ts = new TemplateSchemaService();
  }

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  getTitle() {
    return this.ts.getTitle(this.template);
  }

  initialize(formGroup: FormGroup, templateId: string, pageIndex?:number, model?:MetadataModel): any {
    const id = Number.parseInt(templateId);
    let data;
    this.template = this.td.templateData[id] as TemplateSchema;
    this.model = model ? model : this.td.modelData[id] as MetadataModel;
    data = this.buildFileTree(this.ts.getOrder(this.template), this.ts.getProperties(this.template), this.model, 0, formGroup, null);

    if (this.ts.getPageCount(this.template)) {
      const page = pageIndex ? pageIndex : 0;
      data = this.buildFileTree(this.ts.getOrderofPage(this.template, pageIndex), this.ts.getProperties(this.template), this.model, 0, formGroup, null);
    }
    this.dataChange.next(data);
    return this.model;
  }

  getValues(schema: TemplateSchema, inputType: InputType, modelValue): any[] {
    function getListSingleValue(literals, value, valueLocation): string {
      let map = literals
        .map(function (element) {
          return element.label;
        });
      const index = map.indexOf(value['@value']);
      return map[index];
    }

    function getListMultipleValue(literals, value, valueLocation): string[] {
      let result = [];
      let literal = literals
        .map(function (literal) {
            return literal.label;
          }
        );

      let r = [];
      for (let i = 0; i < value.length; i++) {
        r.push(value[i][valueLocation]);
      }
      result.push(r);
      return result;
    }

    function  getRadioValue(literals, value, valueLocation): number {
      let map = literals
        .map(function (literal) {
            return literal.label;
          }
        );
      return map.indexOf(value[valueLocation]);
    }

    function  getCheckValue(value: [], valueLocation): string[] {
      let result = [];
      for (let i = 0; i < value.length; i++) {
        result.push(value[i][valueLocation]);
      }
      return result;
    }

    function  getTextValue(value, valueLocation): string[] {
      let result = [];
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          result.push(value[i][valueLocation]);
        }
      } else {
        result.push(value[valueLocation]);
      }
      return result;
    }

    function  getDateValue(value, valueLocation): Date[] {
      function parseDate(val) {
        // 'add' a timezone offset so we end up on the original date again
        let dt = new Date(val);
        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        return dt;
      };

      let result = [];
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          result.push(parseDate(value[i][valueLocation]));
        }
      } else {
        result.push(parseDate(value[valueLocation]));
      }
      return result;
    }

    function  getControlledValue(values, valueLocation): string[] {
      let result = [];
      for (let i = 0; i < values.length; i++) {
        result.push(values[i][valueLocation]);
      }
      return result;
    }

    let result = [];
    const valueLocation = this.ts.getValueLocation(schema, inputType);
    const literals = this.ts.getLiterals(schema);
    switch (inputType) {
      case InputType.controlled:
        result = getControlledValue(modelValue, '@id');
        break;
      case InputType.checkbox:
        result.push(getCheckValue(modelValue, valueLocation));
        break;
      case InputType.radio:
        result.push(getRadioValue(literals, modelValue, valueLocation));
        break;
      case InputType.date:
        result = getDateValue(modelValue, valueLocation);
        break;
      case InputType.list:
        if (this.ts.isMultiValue(schema)) {
          result = getListMultipleValue(literals, modelValue, valueLocation);
        } else {
          result.push(getListSingleValue(literals, modelValue, valueLocation));
        }
        break;
      case InputType.textfield:
      case InputType.email:
      case InputType.link:
      case InputType.phoneNumber:
      case InputType.textarea:
      case InputType.numeric:
        result = getTextValue(modelValue, valueLocation);
        break;
      default:
        console.log(inputType)
    }
    return result;
  }

  getLabels(schema: TemplateSchema, inputType: InputType, modelValue): any[] {
    function  getControlledLabel(labels, labelLocation): string[] {
      let result = [];
      for (let i = 0; i < labels.length; i++) {
        result.push(labels[i][labelLocation]);
      }
      return result;
    }
    let result = [];
    if (this.it.isControlled(inputType)) {
      result = getControlledLabel(modelValue, 'rdfs:label');
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

  staticNode(schema: TemplateSchema, model: MetadataModel, inputType: InputType, minItems, maxItems, key:string, modelValue:MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {

    const node = {
      'key': key,
      'model': model,
      'minItems': 0,
      'maxItems': 0,
      'itemCount': 0,
      'name': this.ts.getTitle(schema),
      'type': InputType.static,
      'subtype': inputType,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'value': this.ts.getContent(schema),
      'size': this.ts.getSize(schema)

    };
    return node;
  }

  fieldNode(schema: TemplateSchema, model: MetadataModel, inputType: InputType, minItems, maxItems, key:string, modelValue:MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {

    const node = {
      'key': key,
      'model': model,
      'valueLocation': this.ts.getValueLocation(schema, inputType),
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

  elementNode(schema: TemplateSchema, model: MetadataModel, minItems, maxItems, i, key, level, modelValue, formGroup: FormGroup, parent: FileNode): FileNode {
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
      node['children'] = this.buildFileTree(this.ts.getOrder(schema), this.ts.getProperties(schema), modelValue[i], level + 1, node.formGroup, node);
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

  // build the tree of FileNodes
  buildFileTree(order: string[], properties: SchemaProperties, model: MetadataModel, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return order.reduce<FileNode[]>((accumulator, key) => {
      if (!this.ts.isSpecialKey(key)) {
        const value = properties[key];
        const schema: TemplateSchema = this.ts.schemaOf(value);
        const modelValue: MetadataSnip = (model && model[key]) ? model[key] : [];

        const maxItems = value['maxItems'];
        const minItems = value['minItems'] || 0;
        const name:string = this.ts.getTitle(schema);
        if (this.ts.isElement(schema)) {
          const itemCount = Array.isArray(modelValue) ? modelValue.length : 1;
          for (let i = 0; i < itemCount; i++) {
            let node = this.elementNode(schema, model, minItems, maxItems, i, key, level, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        } else if (this.ts.isStaticField(schema)) {
          let node = this.staticNode(schema, model, this.ts.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
          accumulator = accumulator.concat(node);
        } else if (this.ts.isField(schema)) {
          if (this.it.isAttributeValue(this.ts.getInputType(schema))) {
            const items = this.ts.buildAttributeValues(model, key);
            let node = this.attributeValueNode(schema, model, key, items, formGroup, parent);
            accumulator = accumulator.concat(node);

          } else {
            let node = this.fieldNode(schema, model, this.ts.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        }

      }
      return accumulator;

    }, []);
  }


}
