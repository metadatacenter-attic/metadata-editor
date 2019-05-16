import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {InputTypeService} from "../../services/input-type.service";
import {InputType} from "../../models/input-type";

import {FileNode} from "../../models/file-node";
import {TemplateParserService} from "../../services/template-parser.service";
import {InstanceService} from "../../services/instance.service";
import { faAsterisk, faEnvelope, faCalendar, faFont ,faHashtag, faLink, faPlusSquare,faParagraph, faCheckSquare,faList,faPhoneSquare, faExternalLinkAlt, faDotCircle} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
  providers: []
})
export class QuestionComponent implements OnInit {
  @Input() node: FileNode;
  @Input() classLoader: any;
  @Input() parentGroup: FormGroup;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<any>();
  faAsterisk = faAsterisk;
  faEnvelope = faEnvelope;
  faCalendar = faCalendar;
  faFont = faFont;
  faHashtag = faHashtag;
  faLink = faLink;
  faParagraph = faParagraph;
  faCheckSquare = faCheckSquare;
  faList= faList;
  faPhoneSquare = faPhoneSquare;
  faDotCircle = faDotCircle;
  faExternalLinkAlt = faExternalLinkAlt;
  faPlusSquare=faPlusSquare;

  database: TemplateParserService;
  formGroup: FormGroup;
  _yt;
  player;

  constructor(private fb: FormBuilder, db: TemplateParserService, private cd: ChangeDetectorRef) {
    this.database = db;
  }

  ngOnInit() {
    // build the array of controls and add it to the parent
    const validators = this.getValidators(this.node);
    let name;
    let obj;

    switch (this.node.type) {

      case InputType.static:
      case InputType.youTube:
      case InputType.image:
      case InputType.sectionBreak:
      case InputType.pageBreak:
      case InputType.richText:
        this.formGroup = this.fb.group({values: this.fb.array([])});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.controlled:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildControlled(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.date:
        this.formGroup = this.fb.group({values: this.fb.array(this.allowMultipleControls(this.node, this.disabled, validators))});
        //this.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.textfield:
      case InputType.textarea:
        this.formGroup = this.fb.group({values: this.fb.array(this.allowMultipleControls(this.node, this.disabled, validators))});
        //this.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.radio:
        name = this.node.key + 'radio';
        obj = {};
        obj[name] = new FormControl(this.fb.array([]));
        this.formGroup = this.fb.group(obj);
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.checkbox:
        this.formGroup = this.fb.group({values: this.fb.array(this.allowMultipleOptions(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.list:
        name = this.node.key + 'list';
        obj = {};
        obj[name] = new FormControl(this.fb.array([]));
        this.formGroup = this.fb.group(obj);
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.attributeValue:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildAV(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
    }
  }

  // controlled term was selected
  onSelectedControlled(event) {
    InstanceService.addControlledValue(this.node.model, this.node.key, event['@id'], event['prefLabel']);
  }

  // controlled term was removed
  onRemovedControlled(index) {
    InstanceService.removeControlledValue(this.node.model, this.node.key, index);
  }

  allowsMultiple(type: InputType) {
    return type !== InputType.element && InputTypeService.allowsMultiple(type);
  }

  getValidators(node: FileNode) {
    const validators = [];
    if (node.required) {
      validators.push(Validators.required);
    }
    if (node.subtype === InputType.email) {
      validators.push(Validators.email);
    }
    if (node.min !== null) {
      validators.push(Validators.min(node.min));
    }
    if (node.max !== null) {
      validators.push(Validators.max(node.max));
    }
    if (node.subtype == InputType.numeric) {
      console.log('validator for numeric',node.key)
      validators.push(this.numericValidator());
    }
    if (node.decimals) {
      validators.push(this.decimalValidator(node.decimals));
    }
    if (node.minLength !== null) {
      validators.push(Validators.minLength(node.minLength));
    }
    if (node.maxLength !== null) {
      validators.push(Validators.maxLength(node.maxLength));
    }
    if (node.pattern !== null) {
      validators.push(Validators.pattern(node.pattern));
    }
    if (node.subtype === InputType.url) {
      validators.push(this.urlValidator);
    }
    return validators;
  }

  // validator for min and max
  quantityRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
        return {'quantityRange': true};
      }
      return null;
    };
  }

  // validator for URLs
  numericValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let result = null;
      if (control.value) {
        if (isNaN(Number(control.value))) {
          result = {'numeric': true};
        }
      }
      return result;
    };
  }

  // validator for precision of a number
  decimalValidator(precision: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: { actual: number, required: number } } | null => {
      let result = null;
      if (control.value && (!isNaN(Number(control.value)))) {
        const actual = control.value.split(".")[1].length;
        if (precision !== actual) {
          result = {
            decimal: {
              actual: actual,
              required: precision
            }
          };
        }
      }
      return result;
    };
  }

  // validator for URLs
  urlValidator(url: FormControl): any {
    if (url.pristine) {
      return null;
    }
    const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    url.markAsTouched();
    if (URL_REGEXP.test(url.value)) {
      return null;
    }
    return {
      url: true
    };
  }

  get isValid() {
    let result = false;
    if (this.parentGroup && this.parentGroup.controls.hasOwnProperty(this.node.key)) {
      result = this.parentGroup.controls[this.node.key].valid;
    }
    return result;
  }

  isChecked(node, label) {
    let result = false;
    node.model[node.key].forEach((value, i) => {
      if (value[node.valueLocation] == label) {
        result = true;
      }
    });
    return result;
  }




  // copyAV(node: FileNode, index: number) {
  //   TemplateSchemaService.copyAttributeValue(node.model, node.key, index);
  //   this.formGroup.setControl('values', this.fb.array(this.buildAV(node, this.disabled)));
  //   this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  // }
  //
  // removeAV(node: FileNode, index: number) {
  //   TemplateSchemaService.removeAttributeValue(node.model, node.key, index);
  //   this.formGroup.setControl('values', this.fb.array(this.buildAV(node, this.disabled)));
  //   this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  // }

  // // do you want to filter dates out of the calendar?
  // dateFilter = (d: Date): boolean => {
  //   const day = d.getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // };


  copyItem(node: FileNode, index: number) {
    const validators = this.getValidators(this.node);


    switch (this.node.type) {
      case InputType.controlled:
        let clonedModel = Object.assign({}, node.model[node.key][index]);
        this.node.model[node.key].splice(index, 0, node.model[node.key][index]);
        this.formGroup.setControl('values', this.fb.array(this.buildControlled(node, this.disabled)));
        break;

      case InputType.textfield:
      case InputType.textarea:
      case InputType.date:

        if (node.model) {
          if (Array.isArray(node.model[node.key])) {
            let clonedModel = Object.assign({}, node.model[node.key][index]);
            this.node.model[node.key].splice(index, 0, clonedModel);
          } else {
            let clonedModel = Object.assign({}, node.model[node.key]);
            this.node.model[node.key] = [clonedModel, clonedModel];
          }
        } else {
          this.node.model[node.key] = [null, null];
        }
        this.formGroup.setControl('values', this.fb.array(this.allowMultipleControls(node, this.disabled, validators)));
        //this.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});
        break;
    }
  }

  removeItem(node: FileNode, index: number) {
    const validators = this.getValidators(this.node);
    switch (node.type) {

      case InputType.controlled:
        node.model[node.key].splice(index, 1);
        this.formGroup.setControl('values', this.fb.array(this.buildControlled(node, this.disabled)));
        break;

      case InputType.textfield:
      case InputType.textarea:
      case InputType.date:
        node.model[this.node.key].splice(index, 1);
        //this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
        this.formGroup.setControl('values', this.fb.array(this.allowMultipleControls(node, this.disabled, validators)));
        break;
    }

  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }


  private allowMultipleOptions(node, disabled: boolean): any[] {
    const arr = node.options.map(opt => {
      return this.fb.control({value: false, disabled: disabled});
    });
    return arr;
  }

  getLength(model) {
    return Array.isArray(model) ? model.length : 1;
  }

  private allowMultipleControls(node, disabled: boolean, validators): any[] {
    const arr = [];
    for (let i = 0; i < this.getLength(node.model[node.key]); i++) {
      arr.push(new FormControl({value: null, disabled: disabled, validators:validators}));
    }
    return arr;
  }

  private buildControlled(node: FileNode, disabled: boolean): any[] {
    const arr = [];
    if (node.model[node.key]) {
      if (Array.isArray(node.model[node.key])) {
        let chips = [];
        let ids = [];
        node.model[node.key].forEach((value) => {
          chips.push(value['rdfs:label']);
          ids.push(value['@id']);
        });

        let group = this.fb.group({
          chips: this.fb.array(chips),
          ids: this.fb.array(ids),
          search: new FormControl({disabled: disabled})
        });
        arr.push(group);

      } else {
        let group = this.fb.group({
          chips: this.fb.array([node.model[node.key]['rdfs:label']]),
          ids: this.fb.array([node.model[node.key]['@id']]),
          search: new FormControl({disabled: disabled})
        });
        arr.push(group);
      }
    } else {
      let group = this.fb.group({
        chips: this.fb.array([]),
        ids: this.fb.array([]),
        search: new FormControl({disabled: disabled})
      });
      arr.push(group);
    }

    return arr;
  };

  private buildControlledSingle(node: FileNode, disabled: boolean): any[] {
    const arr = [];
    if (Array.isArray(node.model[node.key])) {
      node.model[node.key].forEach((value) => {
        let group = this.fb.group({
          chips: this.fb.array([value['rdfs:label']]),
          ids: this.fb.array([value['@id']]),
          search: new FormControl({disabled: disabled})
        });
        arr.push(group);
      });
    } else {
      let group = this.fb.group({
        chips: this.fb.array([node.model[node.key]['rdfs:label']]),
        ids: this.fb.array([node.model[node.key]['@id']]),
        search: new FormControl({disabled: disabled})
      });
      arr.push(group);
    }

    return arr;
  };

  // build the av form controls
  private buildAV(node: FileNode, disabled: boolean): any[] {
    const arr = [];
    node.model[node.key].forEach((value) => {
      const items = [];
      items.push(new FormControl({value: '', disabled: disabled}));
      items.push(new FormControl({value: '', disabled: disabled}));
      const group = this.fb.group({values: this.fb.array(items)});
      arr.push(group);
    });
    return arr;
  }

  onChange(event) {
    this.broadcastChanges(event);
  }

  broadcastChanges(event) {
    this.changed.emit({
      'type': event.type,
      'subtype': event.subtype,
      'model': event.model,
      'key': event.key,
      'index': event.index,
      'location': event.valueLocation,
      'value': event.value
    });
  }

}

