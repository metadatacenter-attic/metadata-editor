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

  initialize(formGroup: FormGroup, instance: any, template: any, pageIndex?: number): any {
    this.templateSchema = template as TemplateSchema;
    this.instanceModel = instance as MetadataModel;
    this.formGroup = formGroup;
    this.pageIndex = 0;

    this.dataChange.next(this.buildFileTree(this.templateSchema, this.instanceModel, 0, this.formGroup, null));

  }

  // private instanceLoadedCallback(instanceId) {
  //   const templateInstance = this.ds.getTemplateInstance(instanceId);
  //   const templateId = TemplateSchemaService.isBasedOn(templateInstance);
  //   this.model = templateInstance as MetadataModel;
  //
  //   // load the template it is based on
  //   this.dh
  //     .requireId(DataHandlerDataId.TEMPLATE, templateId)
  //     .load(() => this.templateLoadedCallback(templateId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  // }
  //
  // private templateLoadedCallback(templateId) {
  //   const template = this.ds.getTemplate(templateId);
  //   this.template = template as TemplateSchema;
  //
  //   // build the tree
  //   this.dataChange.next(this.buildFileTree(TemplateSchemaService.getOrder(this.template), TemplateSchemaService.getProperties(this.template), this.model, 0, this.formGroup, null));
  // }
  //
  // private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
  //   this.artifactStatus = error.status;
  //   console.log('dataErrorCallback', error)
  // }


  getValues(schema: TemplateSchema, inputType: InputType, modelValue): any[] {


    function getRadioValue(literals, value, valueLocation): number {
      let map = literals
        .map(function (literal) {
            return literal.label;
          }
        );
      return map.indexOf(value[valueLocation]);
    }

    function getCheckValue(value: [], valueLocation): string[] {
      let result = [];
      for (let i = 0; i < value.length; i++) {
        result.push(value[i][valueLocation]);
      }
      return result;
    }

    function getTextValue(value, valueLocation): string[] {
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

    function getDateValue(value, valueLocation): Date[] {
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
        result.push(getCheckValue(modelValue, valueLocation));
        break;
      case InputType.radio:
        result.push(getRadioValue(literals, modelValue, valueLocation));
        break;
      case InputType.date:
        // dates in the model are different from dates that we can edit; use node.value for editing the date
        result = getDateValue(modelValue, valueLocation);
        break;

      case InputType.textfield:
      case InputType.email:
      case InputType.link:
      case InputType.url:
      case InputType.phoneNumber:
      case InputType.textarea:
      case InputType.numeric:
        result = getTextValue(modelValue, valueLocation);
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
      'value': TemplateSchemaService.getContent(schema),
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

      // constraints
      'min': TemplateSchemaService.getMin(schema),
      'max': TemplateSchemaService.getMax(schema),
      'decimals': TemplateSchemaService.getDecimals(schema),
      'minLength': TemplateSchemaService.getMinStringLength(schema),
      'maxLength': TemplateSchemaService.getMaxStringLength(schema),
      'valueConstraints': TemplateSchemaService.getValueConstraints(schema),

      'value': this.getValues(schema, inputType, modelValue),
      // 'label': this.getLabels(schema, inputType, modelValue),
      'options': TemplateParserService.getOptions(schema, inputType, modelValue),
      'multipleChoice': TemplateSchemaService.isMultiValue(schema),
      'required': TemplateSchemaService.isRequired(schema),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema),

    };
  }

  elementNode(schema: TemplateSchema, model: MetadataModel, label: string,  minItems, maxItems, i, key, level, modelValue, formGroup: FormGroup, parent: FileNode): FileNode {
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
    };
    formGroup.addControl(key + i, node.formGroup);
    if (schema.properties) {
      node['children'] = this.buildFileTree(schema, modelValue[i], level + 1, node.formGroup, node);
    }
    return node;
  }

  static attributeValueNode(schema: TemplateSchema, model: any,   key: string, modelValue: any, formGroup: FormGroup, parent: FileNode): FileNode {

    console.log('attributeValueNode',key, schema, model);
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
  buildFileTree(parentSchema: TemplateSchema , model: MetadataModel, level: number, formGroup: FormGroup, parentNode: FileNode): FileNode[] {
    let order = TemplateSchemaService.getOrder(parentSchema);
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
            let node = this.elementNode(schema, model, label,  minItems, maxItems, i, key, level, modelValue, formGroup, parentNode);
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
