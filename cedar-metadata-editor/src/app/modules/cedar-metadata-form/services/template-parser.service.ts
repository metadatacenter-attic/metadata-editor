import {Inject, Injectable, Optional} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';




import {environment} from '../../../../environments/environment';
import {SchemaProperties, TemplateSchema} from "../models/template-schema";
import {DataHandlerDataId} from "../../shared/model/data-handler-data-id.model";
import {MetadataModel, MetadataSnip} from "../models/metadata-model";
import {DataHandlerService} from "../../../services/data-handler.service";
import {DataStoreService} from "../../../services/data-store.service";
import {InputTypeService} from "./input-type.service";
import {InputType} from "../models/input-type";

import {TemplateSchemaService} from "./template-schema.service";
import {DataHandlerDataStatus} from "../../shared/model/data-handler-data-status.model";
import {FileNode} from "../models/file-node";


@Injectable()
export class TemplateParserService {

  formGroup: FormGroup;
  pageIndex: number;
  dataChange = new BehaviorSubject<FileNode[]>([]);
  model: MetadataModel;
  template: TemplateSchema;


  dh: DataHandlerService;
  ds: DataStoreService;
  artifactStatus: number = null;
  cedarLink: string = null;

  constructor(dataHandler: DataHandlerService,
              dataStore: DataStoreService, @Inject('templateId') @Optional() public templateId?: string,) {
    
    this.dh = dataHandler;
    this.ds = dataStore;
  }

  protected initDataHandler(): DataHandlerService {
    this.dh.reset();
    this.dh.setPreCallback(() => this.preDataIsLoaded());
    return this.dh;
  }

  private preDataIsLoaded() {
  }

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  getTitle() {
    return this.template ? TemplateSchemaService.getTitle(this.template) : "";
  }

  initialize(formGroup: FormGroup, instanceId: string, pageIndex?: number, model?: MetadataModel): any {

    this.formGroup = formGroup;
    this.pageIndex = pageIndex;

    // load the instance
    this.initDataHandler();
    this.cedarLink = environment.cedarUrl + 'instances/edit/' + instanceId;
    this.dh
      .requireId(DataHandlerDataId.TEMPLATE_INSTANCE, instanceId)
      .load(() => this.instanceLoadedCallback(instanceId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));

  }

  private instanceLoadedCallback(instanceId) {
    const templateInstance = this.ds.getTemplateInstance(instanceId);
    const templateId = TemplateSchemaService.isBasedOn(templateInstance);
    this.model = templateInstance as MetadataModel;

    // load the template it is based on
    this.dh
      .requireId(DataHandlerDataId.TEMPLATE, templateId)
      .load(() => this.templateLoadedCallback(templateId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private templateLoadedCallback(templateId) {
    const template = this.ds.getTemplate(templateId);
    this.template = template as TemplateSchema;

    // build the tree
    this.dataChange.next(this.buildFileTree(TemplateSchemaService.getOrder(this.template), TemplateSchemaService.getProperties(this.template), this.model, 0, this.formGroup, null));
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
    console.log('dataErrorCallback', error)
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
      let result = [];
      let source =   Array.isArray(values) ? values : [values];
      for (let i = 0; i < source.length; i++) {
        result.push(source[i][valueLocation]);
      }
      return result;
    }

    let result = [];
    const valueLocation = TemplateSchemaService.getValueLocation(schema, inputType);
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
        result = getDateValue(modelValue, valueLocation);
        break;
      case InputType.list:
        if (TemplateSchemaService.isMultiValue(schema)) {
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
    function getControlledLabel(labels, labelLocation): string[] {
      let result = [];
      let source =   Array.isArray(labels) ? labels : [labels];
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

  static getNodeType(schema: TemplateSchema,inputType: InputType): InputType {
    return TemplateSchemaService.getInputType(schema);
  }

  static getSubtype(inputType) {
    return InputTypeService.isNotTextInput(inputType) ? '' : inputType;
  }

  static staticNode(schema: TemplateSchema, model: MetadataModel, inputType: InputType, minItems, maxItems, key: string, modelValue: MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {

    return  {
      'key': key,
      'model': model,
      'minItems': 0,
      'maxItems': 0,
      'itemCount': 0,
      'name': TemplateSchemaService.getTitle(schema),
      'type': InputType.static,
      'subtype': inputType,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'value': TemplateSchemaService.getContent(schema),
      'size': TemplateSchemaService.getSize(schema)

    };

  }

  fieldNode(schema: TemplateSchema, model: MetadataModel, inputType: InputType, minItems, maxItems, key: string, modelValue: MetadataSnip, formGroup: FormGroup, parent: FileNode): FileNode {

    const type = TemplateParserService.getNodeType(schema, inputType);
    const subtype = TemplateParserService.getSubtype(inputType);
    return {
      'key': key,
      'model': model,
      'valueLocation': TemplateSchemaService.getValueLocation(schema, inputType),
      'name': TemplateSchemaService.getTitle(schema),
      'type': type,
      'subtype': subtype,
      'minItems': minItems,
      'maxItems': maxItems,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'min': TemplateSchemaService.getMin(schema),
      'max': TemplateSchemaService.getMax(schema),
      'decimals': TemplateSchemaService.getDecimals(schema),
      'minLength': TemplateSchemaService.getMinStringLength(schema),
      'maxLength': TemplateSchemaService.getMaxStringLength(schema),
      'value': this.getValues(schema, inputType, modelValue),
      'label': this.getLabels(schema, inputType, modelValue),
      'options': TemplateParserService.getOptions(schema, inputType, modelValue),
      'multipleChoice': TemplateSchemaService.isMultiValue(schema),
      'required': TemplateSchemaService.isRequired(schema),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema)
    };
  }

  elementNode(schema: TemplateSchema, model: MetadataModel, minItems, maxItems, i, key, level, modelValue, formGroup: FormGroup, parent: FileNode): FileNode {
    const node = {
      'key': key,
      'model': model,
      'name': TemplateSchemaService.getTitle(schema),
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
      node['children'] = this.buildFileTree(TemplateSchemaService.getOrder(schema), TemplateSchemaService.getProperties(schema), modelValue[i], level + 1, node.formGroup, node);
    }
    return node;
  }

  static attributeValueNode(schema: TemplateSchema, model: any, key: string, modelValue: any, formGroup: FormGroup, parent: FileNode): FileNode {

    return {

      'min': TemplateSchemaService.getMin(schema),
      'max': TemplateSchemaService.getMax(schema),
      'required': TemplateSchemaService.isRequired(schema),
      'key': key,
      'model': model,
      'valueLocation': '@value',
      'name': TemplateSchemaService.getTitle(schema),
      'type': InputType.attributeValue,
      'subtype': InputType.attributeValue,
      'minItems': 1,
      'maxItems': 5,
      'itemCount': 0,
      'formGroup': formGroup,
      'parentGroup': parent ? parent.formGroup : null,
      'parent': parent,
      'value': modelValue,
      'label': TemplateSchemaService.getTitle(schema),
      'help': TemplateSchemaService.getHelp(schema),
      'placeholder': TemplateSchemaService.getPlaceholder(schema),
      'hint': TemplateSchemaService.getHint(schema)
    };
  }

  // build the tree of FileNodes
  buildFileTree(order: string[], properties: SchemaProperties, model: MetadataModel, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return order.reduce<FileNode[]>((accumulator, key) => {
      if (!TemplateSchemaService.isSpecialKey(key)) {
        const value = properties[key];
        const schema: TemplateSchema = TemplateSchemaService.schemaOf(value);
        const modelValue: MetadataSnip = (model && model[key]) ? model[key] : [];

        const maxItems = value['maxItems'];
        const minItems = value['minItems'] || 0;
        const name: string = TemplateSchemaService.getTitle(schema);
        if (TemplateSchemaService.isElement(schema)) {
          const itemCount = Array.isArray(modelValue) ? modelValue.length : 1;
          for (let i = 0; i < itemCount; i++) {
            let node = this.elementNode(schema, model, minItems, maxItems, i, key, level, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        } else if (TemplateSchemaService.isStaticField(schema)) {
          let node = TemplateParserService.staticNode(schema, model, TemplateSchemaService.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
          accumulator = accumulator.concat(node);
        } else if (TemplateSchemaService.isField(schema)) {
          if (InputTypeService.isAttributeValue(TemplateSchemaService.getInputType(schema))) {
            const items = TemplateSchemaService.buildAttributeValues(model, key);
            let node = TemplateParserService.attributeValueNode(schema, model, key, items, formGroup, parent);
            accumulator = accumulator.concat(node);

          } else {
            let node = this.fieldNode(schema, model, TemplateSchemaService.getInputType(schema), minItems, maxItems, key, modelValue, formGroup, parent);
            accumulator = accumulator.concat(node);
          }
        }

      }
      return accumulator;

    }, []);
  }


}
