import {Component, Inject, OnInit, Optional} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocalSettingsService} from "../../../../services/local-settings.service";
import {UiService} from "../../../../services/ui/ui.service";
import {DataHandlerService} from "../../../../services/data-handler.service";
import {DataStoreService} from "../../../../services/data-store.service";
import {FileNode} from "../../../cedar-metadata-form/models/file-node";
import {TemplateSchemaService} from "../../../cedar-metadata-form/services/template-schema.service";
import {MetadataModel} from "../../../cedar-metadata-form/models/metadata-model";
import {environment} from "../../../../../environments/environment";
import {DataHandlerDataId} from "../../../shared/model/data-handler-data-id.model";
import {TemplateSchema} from "../../../cedar-metadata-form/models/template-schema";
import {DataHandlerDataStatus} from "../../../shared/model/data-handler-data-status.model";


@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: []
})

export class InstanceComponent implements OnInit {
  form: FormGroup;
  instanceId: string;
  templateId:string;

  template: any;
  instance: any;

  route: ActivatedRoute;
  payload: any;
  jsonLD: any;
  rdf: any;
  id: string;
  formValid: boolean;
  viewOnly: boolean = false;
  ui: UiService;
  _tr:TranslateService;
  _ls:LocalSettingsService;
  dh: DataHandlerService;
  ds: DataStoreService;
  artifactStatus: number = null;
  cedarLink: string = null;

  darkMode: boolean;
  private _darkModeSub: Subscription;


  constructor(ui: UiService, route: ActivatedRoute, ls: LocalSettingsService, tr: TranslateService, dataHandler: DataHandlerService,
              dataStore: DataStoreService,) {
    this.route = route;
    this.ui = ui;
    this._tr = tr;
    this._ls = ls;

    this.dh = dataHandler;
    this.ds = dataStore;

  }

  classLoader(param) {
    console.log('classLoader', param);
  }

  ngOnInit() {
    this.route.params.subscribe((val) => {
      this.id = val.templateId;
      this.initialize(this.id);
    });

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

  protected initDataHandler(): DataHandlerService {
    this.dh.reset();
    this.dh.setPreCallback(() => this.preDataIsLoaded());
    return this.dh;
  }

  private preDataIsLoaded() {
  }

  // get data(): FileNode[] {
  //   return this.dataChange.value;
  // }

  // getTitle() {
  //   return this.template ? TemplateSchemaService.getTitle(this.template) : "";
  // }

  initialize(instanceId: string): any {
    this.instanceId = instanceId;

    // load the instance
    this.initDataHandler();
    this.cedarLink = environment.cedarUrl + 'instances/edit/' + instanceId;
    this.dh
      .requireId(DataHandlerDataId.TEMPLATE_INSTANCE, instanceId)
      .load(() => this.instanceLoadedCallback(instanceId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private instanceLoadedCallback(instanceId) {
    this.instance = this.ds.getTemplateInstance(instanceId);
    this.templateId = TemplateSchemaService.isBasedOn(this.instance);

    // load the template it is based on
    this.dh
      .requireId(DataHandlerDataId.TEMPLATE, this.templateId)
      .load(() => this.templateLoadedCallback(this.templateId, ), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private templateLoadedCallback(templateId) {
    const template = this.ds.getTemplate(templateId);
    this.template = template as TemplateSchema;

    // build the tree
    //this.dataChange.next(this.buildFileTree(TemplateSchemaService.getOrder(this.template), TemplateSchemaService.getProperties(this.template), this.model, 0, this.formGroup, null));
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
    console.log('dataErrorCallback', error)
  }



  // form changed, update tab contents and submit button status
  protected onChanged(event) {
    const e = event;
    setTimeout(() => {
      this.payload = e.payload;
      this.jsonLD = e.jsonLD;
      this.rdf = e.rdf;
      this.formValid = e.formValid;
      // //TODO debug rdf change delay
      // if (e.rdf) {
      //   console.log('rdf 777', JSON.stringify(e.rdf).indexOf('777'));
      // }

    }, 0);
  }

  // toggle edit/view button
  toggleDisabled() {
    this.viewOnly = !this.viewOnly;
  }

  // copy stuff in tabs to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {

    function copyToClip(str) {
      function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
      }

      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);
    }

    let elm = document.getElementById(elementId);
    let data = elm ? elm.innerHTML : null;
    if (data) {

      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = data;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      copyToClip(data);
      document.body.removeChild(selBox);

      let btn = document.getElementById(buttonId);
      if (btn) {
        btn.innerHTML = 'Copied';
        setTimeout(() => {
          let btn = document.getElementById(buttonId);
          if (btn) {
            btn.innerHTML = 'Copy';
          }
        }, 10000);
      }
    }
  }

  onSubmit() {
    console.log('onSubmit')
  }


}
