import {Component, OnInit, SchemaMetadata} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {forkJoin} from 'rxjs';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {LocalSettingsService} from "../../../../services/local-settings.service";
import {UiService} from "../../../../services/ui.service";
import {DataHandlerService} from "../../../../services/data-handler.service";
import {DataStoreService} from "../../../../services/data-store.service";
import {DataHandlerDataId} from "../../../shared/model/data-handler-data-id.model";
import {DataHandlerDataStatus} from "../../../shared/model/data-handler-data-status.model";
import {AutocompleteService} from "../../services/autocomplete.service";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import * as jsonld from 'jsonld';
import {TemplateService} from "../../services/template.service";
import {
  faAsterisk,
  faCalendar,
  faCheckSquare,
  faDotCircle,
  faEnvelope,
  faExternalLinkAlt,
  faFont,
  faHashtag,
  faLink,
  faList,
  faParagraph,
  faPhoneSquare,
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss'],
  providers: []
})

export class InstanceComponent implements OnInit {
  form: FormGroup;
  instanceId: string;
  templateId: string;
  templateElementId: string;
  templateFieldId: string;

  template: any;
  instance: any;
  rdf: any;
  mode: string;

  route: ActivatedRoute;
  payload: any;
  jsonLD: any;

  formValid: boolean;
  ui: UiService;
  _ls: LocalSettingsService;
  dh: DataHandlerService;
  ds: DataStoreService;
  artifactStatus: number = null;
  cedarLink: string = null;

  showForm: boolean;

  allPosts;

  CUSTOM_ELEMENTS_SCHEMA: SchemaMetadata;
  faAsterisk = faAsterisk;
  faEnvelope = faEnvelope;
  faHashtag = faHashtag;
  faLink = faLink;
  faFont = faFont;
  faCalendar = faCalendar;
  faPhoneSquare = faPhoneSquare;
  faParagraph = faParagraph;
  faCheckSquare = faCheckSquare;
  faList = faList;
  faDotCircle = faDotCircle;
  faPlusSquare = faPlusSquare;
  faExternalLinkAlt = faExternalLinkAlt;


  constructor(ui: UiService, route: ActivatedRoute, ls: LocalSettingsService, private translateService: TranslateService, dataHandler: DataHandlerService,
              dataStore: DataStoreService, private http: HttpClient, private autocompleteService: AutocompleteService) {
    this.route = route;
    this.ui = ui;
    this._ls = ls;

    this.dh = dataHandler;
    this.ds = dataStore;
    this.showForm = true;
    this.mode = 'edit';

  }

  protected onAutocomplete(event) {
    const detail = event['detail'];
    if (detail['search']) {
      forkJoin(this.autocompleteService.getPosts(detail['search'], detail.constraints)).subscribe(posts => {
        this.allPosts = [];
        for (let i = 0; i < posts.length; i++) {
          this.allPosts = this.allPosts.concat(posts[i]['collection']);
        }
      });
    }
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.route.params.subscribe((val) => {
      this.allPosts = [];
      if (val.instanceId) {
        this.initialize(val.instanceId, null, null, null);
      } else if (val.templateId) {
        this.initialize(val.instanceId, val.templateId, null, null);
      } else if (val.templateElementId) {
        this.initialize(val.instanceId, null, val.templateElementId, null);
      } else if (val.templateFieldId) {
        this.initialize(val.instanceId, val.templateId, null, val.templateFieldId);
      }

    });

    // watch for changes
    this.form.valueChanges.subscribe(value => {
      setTimeout(() => {
        const that = this;
        jsonld.toRDF(this.instance, {format: 'application/nquads'}, function (err, nquads) {
          that.rdf = err ? err : nquads;
        });
      }, 0);
    });

  }

  protected initDataHandler(): DataHandlerService {
    this.dh.reset();
    this.dh.setPreCallback(() => this.preDataIsLoaded());
    return this.dh;
  }

  private preDataIsLoaded() {
  }

  initialize(instanceId: string, templateId: string, templateElementId: string, templateFieldId: string): any {
    this.instanceId = instanceId;
    this.templateId = templateId;
    this.templateElementId = templateElementId;
    this.templateFieldId = templateFieldId;

    if (instanceId) {
      this.initDataHandler();
      this.cedarLink = environment.cedarUrl + 'instances/edit/' + instanceId;
      this.dh
        .requireId(DataHandlerDataId.TEMPLATE_INSTANCE, instanceId)
        .load(() => this.instanceLoadedCallback(instanceId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
    } else if (templateId) {
      // load the template it is based on
      this.dh
        .requireId(DataHandlerDataId.TEMPLATE, this.templateId)
        .load(() => this.templateLoadedCallback(this.templateId,), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
    } else if (templateElementId) {
      // load the template it is based on
      this.dh
        .requireId(DataHandlerDataId.TEMPLATE_ELEMENT, this.templateElementId)
        .load(() => this.templateElementLoadedCallback(this.templateElementId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
    } else if (templateFieldId) {
      // load the template it is based on
      this.dh
        .requireId(DataHandlerDataId.TEMPLATE_FIELD, this.templateFieldId)
        .load(() => this.templateFieldLoadedCallback(this.templateFieldId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
    }
  }

  private instanceLoadedCallback(instanceId) {
    this.instance = this.ds.getTemplateInstance(instanceId);
    this.templateId = TemplateService.isBasedOn(this.instance);

    // load the template it is based on
    this.dh
      .requireId(DataHandlerDataId.TEMPLATE, this.templateId)
      .load(() => this.templateLoadedCallback(this.templateId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));
  }

  private templateLoadedCallback(templateId) {
    this.template = this.ds.getTemplate(templateId);
    this.instance = TemplateService.initInstance(this.template);
  }

  private templateElementLoadedCallback(templateElementId) {
    this.template = this.ds.getTemplateElement(templateElementId);
    this.instance = TemplateService.initInstance(this.template);
  }

  private templateFieldLoadedCallback(templateFieldId) {
    this.template = this.ds.getTemplateField(templateFieldId);
    this.instance = TemplateService.initInstance(this.template);
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    this.artifactStatus = error.status;
  }

  // form changed, update tab contents and submit button status
  public onFormChanged(event) {
    this.payload = event.detail.payload;
    this.jsonLD = event.detail.jsonLD;
    this.rdf = event.detail.rdf;
    this.formValid = event.detail.formValid;
  }


  // form changed, update tab contents and submit button status
  protected onChanged(event) {
    const e = event;
    setTimeout(() => {
      this.payload = e.payload;
      this.jsonLD = e.jsonLD;
      this.rdf = e.rdf;
      this.formValid = e.formValid;
    }, 0);
  }

  // toggle edit/view button
  toggleMode() {
    this.mode = this.mode === 'edit' ? 'view' : 'edit';
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
        btn.innerHTML = this.translateService.instant('App.Copied');
        setTimeout(() => {
          let btn = document.getElementById(buttonId);
          if (btn) {
            btn.innerHTML = this.translateService.instant('App.Copy');
          }
        }, 10000);
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormArray) {
        control.controls.forEach(cntl => {
          cntl.markAsTouched({onlySelf: true});
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  getType() {
    return 'element';
  }

  selectedTabChange(event) {

    if (event.index === 0) {
      setTimeout(() => {
        this.showForm = true;
      }, 0);

    } else {
      this.showForm = false;
    }
  }

  // form changed, update tab contents and submit button status
  onFormChange(event) {
    if (event && event.detail) {
      // this.uiService.setTitleAndDescription(event.detail.title, event.detail.description);
      // this.uiService.setValidity(event.detail.validity);
    }
  }

}
