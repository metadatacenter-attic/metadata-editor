import {Injectable} from '@angular/core';
import * as uuid from 'uuid';
import {LocalSettingsService} from './local-settings.service';
import {Template} from '../shared/model/template.model';
import {TemplateField} from '../shared/model/template-field.model';
import {TemplateElement} from '../shared/model/template-element.model';
import {TemplateInstance} from '../shared/model/template-instance.model';
import {ControlledOntology} from "../shared/model/controlled-ontology.model";

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  private static cedarClientSessionId: string = uuid();

  private readonly templateFieldMap: Map<string, TemplateField>;
  private readonly templateElementMap: Map<string, TemplateElement>;
  private readonly templateMap: Map<string, Template>;
  private readonly templateInstanceMap: Map<string, TemplateInstance>;
  private readonly ontologyRootClassesMap: Map<string, ControlledOntology>;

  constructor(
    private localSettings: LocalSettingsService
  ) {
    this.templateFieldMap = new Map<string, TemplateField>();
    this.templateElementMap = new Map<string, TemplateElement>();
    this.templateMap = new Map<string, Template>();
    this.templateInstanceMap = new Map<string, TemplateInstance>();
    this.ontologyRootClassesMap = new Map<string, ControlledOntology>();
  }

  public static getCedarClientSessionId() {
    return DataStoreService.cedarClientSessionId;
  }

  setTemplateField(templateFieldId: string, templateField: TemplateField) {
    this.templateFieldMap[templateFieldId] = templateField;
  }

  getTemplateField(templateFieldId: string): TemplateField {
    return this.templateFieldMap[templateFieldId];
  }

  setTemplateElement(templateElementId: string, templateElement: TemplateElement) {
    this.templateElementMap[templateElementId] = templateElement;
  }

  getTemplateElement(templateElementId: string): TemplateElement {
    return this.templateElementMap[templateElementId];
  }

  setTemplate(templateId: string, template: Template) {
    this.templateMap[templateId] = template;
  }

  getTemplate(templateId: string): Template {
    return this.templateMap[templateId];
  }

  setTemplateInstance(templateInstanceId: string, templateInstance: TemplateInstance) {
    this.templateInstanceMap[templateInstanceId] = templateInstance;
  }

  getTemplateInstance(templateInstanceId: string): TemplateInstance {
    return this.templateInstanceMap[templateInstanceId];
  }

  getOntologyRootClasses(ontologyId: string): ControlledOntology {
    return this.ontologyRootClassesMap[ontologyId];
  }

  setOntologyRootClasses(ontologyId: string, ontology: ControlledOntology) {
    this.ontologyRootClassesMap[ontologyId] = ontology;
  }

}
