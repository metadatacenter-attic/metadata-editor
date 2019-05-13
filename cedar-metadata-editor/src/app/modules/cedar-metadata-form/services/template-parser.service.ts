import {Inject, Injectable, Optional} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {SchemaProperties, TemplateSchema} from "../models/template-schema";
import {MetadataModel, MetadataSnip} from "../models/metadata-model";
import {InputTypeService} from "./input-type.service";
import {InputType} from "../models/input-type";

import {TemplateSchemaService} from "./template-schema.service";
import {FileNode} from "../models/file-node";


@Injectable()
export class TemplateParserService {

  formGroup: FormGroup;
  pageIndex: number;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  instanceModel: MetadataModel;
  templateSchema: TemplateSchema;

  constructor(@Inject('instance') @Optional() public instance?: any, @Inject('template') @Optional() public template?: any) {
    this.templateSchema = template as TemplateSchema;
    this.instanceModel = instance as MetadataModel;
  }

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  getTitle() {
    return this.template ? TemplateSchemaService.getTitle(this.template, null) : "";
  }

  initialize(formGroup: FormGroup, instance: any, template: any, page: number): any {
    this.templateSchema = template as TemplateSchema;
    this.instanceModel = instance as MetadataModel;
    this.formGroup = formGroup;
    this.pageIndex = 0;
    this.dataChange.next(this.buildFileTree(this.templateSchema, this.instanceModel, 0, this.formGroup, null, page));
  }

  getValues(schema: TemplateSchema, inputType: InputType, modelValue): any[] {

    function getControlledValue(values, valueLocation): string[] {
      console.log('values',values)
      // values
      // let result = [];
      //
      //
      // let r = [];
      // for (let i = 0; i < value.length; i++) {
      //   r.push(value[i][valueLocation]);
      // }
      // result.push(r);
      // return result;

      let result = [];
      let source = Array.isArray(values) ? values : [values];
      for (let i = 0; i < source.length; i++) {
        result.push(source[i][valueLocation]);
      }
      console.log('result',result)
      return result;
    }

    let result = [];
    const nodeType = TemplateParserService.getNodeType(schema, inputType);
    const nodeSubtype = TemplateParserService.getNodeSubtype(inputType);

    const valueLocation = TemplateSchemaService.getValueLocation(schema, nodeType, nodeSubtype);
    const literals = TemplateSchemaService.getLiterals(schema);
    switch (inputType) {
      case InputType.controlled:
        result = getControlledValue(modelValue, '@id');
        break;
      case InputType.checkbox:
        // result.push(getCheckValue(modelValue, valueLocation));
        break;
      case InputType.radio:
        //result.push(getRadioValue(literals, modelValue, valueLocation));
        break;
      case InputType.date:
        // dates in the model are different from dates that we can edit; use node.value for editing the date
        //result = getDateValue(modelValue, valueLocation);
        break;

      case InputType.textfield:
      case InputType.email:
      case InputType.link:
      case InputType.url:
      case InputType.phoneNumber:
      case InputType.textarea:
      case InputType.numeric:
        //result = getTextValue(modelValue, valueLocation);
        break;
      default:
    }
    return result;
  }

  getLabels(schema: TemplateSchema, inputType: InputType, modelValue): any[] {
    function getControlledLabel(labels, labelLocation): string[] {
      console.log('labels',labels)
      let result = [];
      let source = Array.isArray(labels) ? labels : [labels];
      for (let i = 0; i < source.length; i++) {
        result.push(source[i][labelLocation]);
      }
      return result;
    }

    let result = [];
    if (InputTypeService.isControlled(inputType)) {
      result = getControlledLabel(modelValue, 'rdfs:label');
    }
    return result;
  }

  static getOptions(schema: TemplateSchema, inputType: InputType, modelValue) {
    let options: any[] = [];
    if (InputTypeService.isRadioCheckList(inputType)) {
      const literals = TemplateSchemaService.getLiterals(schema);
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

  static getNodeType(schema: TemplateSchema, inputType: InputType): InputType {
    let result: InputType;
    switch (inputType) {
      case InputType.numeric:
      case InputType.phoneNumber:
      case InputType.email:
      case InputType.link:
        result = InputType.textfield;
        break;
      case InputType.pageBreak:
      case InputType.sectionBreak:
      case InputType.richText:
      case InputType.image:
      case InputType.youTube:
        result = InputType.static;
        break;
      default:
        result = inputType;
        break;
    }
    return result;
  }

  static getNodeSubtype(inputType) {
    let result: InputType;
    switch (inputType) {
      case InputType.youTube:
        result = InputType.youTube;
        break;
      case InputType.image:
        result = InputType.image;
        break;
      case InputType.richText:
        result = InputType.richText;
        break;
      case InputType.sectionBreak:
        result = InputType.sectionBreak;
        break;
      case InputType.pageBreak:
        result = InputType.pageBreak;
        break;
      case InputType.email:
        result = InputType.email;
        break;
      case InputType.numeric:
        result = InputType.number;
        break;
      case InputType.link:
        result = InputType.url;
        break;
      case InputType.phoneNumber:
        result = InputType.tel;
        break;
      default:
        result = InputType.text;
        break;
    }
    return result;
  }

  static staticNode(schema: TemplateSchema, model: MetadataModel, inputType: InputType, minItems, maxItems, key: string, modelValue: MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {
    const nodeType = TemplateParserService.getNodeType(schema, inputType);
    const nodeSubtype = TemplateParserService.getNodeSubtype(inputType);
    return {
      'key': key,
      'model': model,
      'minItems': 0,
      'maxItems': 0,
      'itemCount': 0,
      'name': TemplateSchemaService.getTitle(schema, null),
      'type': nodeType,
      'subtype': nodeSubtype,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'staticValue': TemplateSchemaService.getContent(schema),
      'size': TemplateSchemaService.getSize(schema)

    };

  }

  fieldNode(schema: TemplateSchema,  model: MetadataModel,propertyLabel: string, inputType: InputType, minItems, maxItems, key: string, modelValue: MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {

    const nodeType = TemplateParserService.getNodeType(schema, inputType);
    const nodeSubtype = TemplateParserService.getNodeSubtype(inputType);
    return {
      'key': key,
      'model': model,
      'name': TemplateSchemaService.getTitle(schema, propertyLabel),
      'type': nodeType,
      'subtype': nodeSubtype,
      'minItems': minItems,
      'maxItems': maxItems,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'valueLocation': TemplateSchemaService.getValueLocation(schema, nodeType, nodeSubtype),

      // for the moment, don't make controlled items multiSelect
      'multiSelect': (minItems !== undefined && nodeType !== InputType.controlled),
      'multipleChoice': TemplateSchemaService.isMultiValue(schema),
      'min': TemplateSchemaService.getMin(schema),
      'max': TemplateSchemaService.getMax(schema),
      'decimals': TemplateSchemaService.getDecimals(schema),
      'minLength': TemplateSchemaService.getMinStringLength(schema),
      'maxLength': TemplateSchemaService.getMaxStringLength(schema),
      'valueConstraints': TemplateSchemaService.getValueConstraints(schema),
      'options': TemplateParserService.getOptions(schema, inputType, modelValue),
      'required': TemplateSchemaService.isRequired(schema),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema),

    };
  }

  elementNode(schema: TemplateSchema, model: MetadataModel, label: string,  minItems, maxItems, i, key, level, modelValue, formGroup: FormGroup, parent: FileNode, page:number): FileNode {
    const node = {
      'key': key,
      'model': model,
      'name': TemplateSchemaService.getTitle(schema, label),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema),
      'minItems': minItems,
      'maxItems': maxItems,
      'itemCount': i,
      'parent': parent,
      'parentGroup': parent ? parent.formGroup : null,
      'formGroup': new FormGroup({}),
      'multiSelect': (minItems !== undefined),
    };
    formGroup.addControl(key + i, node.formGroup);
    if (schema.properties) {
      node['children'] = this.buildFileTree(schema, modelValue[i], level + 1, node.formGroup, node, page);
    }
    return node;
  }

  static attributeValueNode(schema: TemplateSchema, model: any,   key: string, modelValue: any, formGroup: FormGroup, parent: FileNode): FileNode {
    const nodeType = TemplateParserService.getNodeType(schema, InputType.attributeValue);
    const nodeSubtype = TemplateParserService.getNodeSubtype(InputType.attributeValue);
    return {
      'min': TemplateSchemaService.getMin(schema),
      'max': TemplateSchemaService.getMax(schema),
      'required': TemplateSchemaService.isRequired(schema),
      'key': key,
      'model': model,
      'valueLocation': TemplateSchemaService.getValueLocation(schema, nodeType,nodeSubtype),
      'name': TemplateSchemaService.getTitle(schema),
      'type': nodeType,
      'subtype': nodeSubtype,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      // 'value': modelValue,
      // 'label': TemplateSchemaService.getTitle(schema),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema)
    };
  }

  // build the tree of FileNodes
  buildFileTree(parentSchema: TemplateSchema , model: MetadataModel, level: number, formGroup: FormGroup, parentNode: FileNode, page:number): FileNode[] {
    let order = TemplateSchemaService.getOrderofPage(parentSchema, page);
    let properties =  TemplateSchemaService.getProperties(parentSchema);
    let labels = TemplateSchemaService.getLabels(parentSchema);

    return order.reduce<FileNode[]>((accumulator, key) => {
      if (!TemplateSchemaService.isSpecialKey(key)) {
        const value = properties[key];
        const maxItems = value['maxItems'];
        const minItems = value['minItems'] || 0;
        const schema = TemplateSchemaService.schemaOf(value);
        const type = TemplateSchemaService.getInputType(schema);
        const label = labels[key];
        const modelValue: MetadataSnip = (model && model[key]) ? model[key] : [];

        if (TemplateSchemaService.isElement(schema)) {
          const itemCount = Array.isArray(modelValue) ? modelValue.length : 1;
          for (let i = 0; i < itemCount; i++) {
            let node = this.elementNode(schema, model, label,  minItems, maxItems, i, key, level, modelValue, formGroup, parentNode, 0);
            accumulator = accumulator.concat(node);
          }

        } else if (TemplateSchemaService.isStaticField(schema)) {
          let node = TemplateParserService.staticNode(schema, model, type, minItems, maxItems, key, modelValue, formGroup, parentNode);
          accumulator = accumulator.concat(node);

        } else if (TemplateSchemaService.isField(schema)) {

          if (InputTypeService.isAttributeValue(type)) {
            const items = TemplateSchemaService.buildAttributeValue(model, key);
            let node = TemplateParserService.attributeValueNode(schema, model, key, items, formGroup, parentNode);
            accumulator = accumulator.concat(node);

          } else {
            let node = this.fieldNode(schema,  model, label, type, minItems, maxItems, key, modelValue, formGroup, parentNode);
            accumulator = accumulator.concat(node);
          }
        }

      }
      return accumulator;

    }, []);
  }


}
