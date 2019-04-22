import {Component, Input, OnInit, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl, AbstractControl, ValidatorFn} from '@angular/forms';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';



import {FileNode} from '../_models/file-node';
import {ControlledTermService} from '../service/controlled-terms.service';
import {TemplateSchemaService} from '../service/template-schema.service';
import {InputType, InputTypeService} from '../_models/input-types';
import {Post} from "../_models/post";
import {ControlledComponent} from '../controlled/controlled.component';
import {TemplateService} from "../service/template.service";
import {ElementService} from "../element/service/element.service";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
  providers: []
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<any>();

  formGroup: FormGroup;
  post: Post[];
  controlled: ControlledComponent;
  controlledGroup: FormGroup;
  copy:string="Copy";
  remove:string="Remove";



  _fb: FormBuilder;
  _it: InputTypeService;
  _ts: TemplateSchemaService;
  _ct: ControlledTermService;
  _yt;
  player;
  //private id: string = 'mw816POGRrk';


  constructor(fb: FormBuilder, ct: ControlledTermService, ts: TemplateSchemaService, yt: NgxYoutubePlayerModule) {
    this._fb = fb;
    this._ct = ct;
    this._ts = ts;
    this._it = new InputTypeService();
    this._yt = new NgxYoutubePlayerModule();
    this.player = this._yt.Player;
  }

  ngAfterViewInit() {
  }

  console(obj: any) {
    console.log('console', obj);
  }

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }

  ngOnInit() {
    this._ct.getPosts().subscribe(posts => {
      this.post = posts;
      this._ct.postsData = posts;
    });

    // build the array of controls and add it to the parent
    const validators = this.getValidators(this.node);
    const arr = [];
    switch (this.node.type) {

      case InputType.youTube:
      case InputType.image:
      case InputType.sectionBreak:
      case InputType.pageBreak:
      case InputType.richText:
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.controlled:
        this.controlledGroup = this._fb.group({
          chips: this._fb.array(this.node.label),
          ids: this._fb.array(this.node.value),
          search: new FormControl({disabled: this.disabled})
        });
        arr.push(this.controlledGroup);
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.date:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: new Date(value), disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.textfield:
      case InputType.textarea:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: value, disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.list:
        this.node.value.forEach((value, i) => {
          const control = new FormControl({value: value, disabled: this.disabled}, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.attributeValue:
        this.node.value.forEach((value, i) => {
          const items = [];
          const controlValue = new FormControl({value: value['rdfs:label'], disabled: this.disabled}, validators);
          items.push(controlValue);
          const controlLabel = new FormControl({value: value['@value'], disabled: this.disabled}, validators);
          items.push(controlLabel);
          const fg = this._fb.group({values: this._fb.array(items)});
          arr.push(fg);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.radio:
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          const control = new FormControl({value: this.node.value[index], disabled: this.disabled});
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.checkbox:
        console.log('checkbox', this.node.value, this.node.model[this.node.key]);
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          let control = new FormControl({value: this.node.value[index], disabled: this.disabled});
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
    }
  }

  // controlled term was selected
   onSelectedControlled(event) {
    this._ts.addControlledValue(this.node.model, this.node.key, event.id, event.title);
  }

  // controlled term was removed
   onRemovedControlled(index) {
    this._ts.removeControlledValue(this.node.model, this.node.key, index);
  }

  allowsMultiple(type: InputType) {
    return this._it.allowsMultiple(type);
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
    if (node.subtype === InputType.link) {
      // validators.push(this.validateUrl);
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
    console.log('isValid', result)
    return result;
  }

  onChanges(node: FileNode, index: number, value: any) {
    this.changed.emit({'type': node.type, 'subtype': node.subtype,'model':node.model,'key':node.key, 'index':index,'location': node.valueLocation, 'value':value});
  }

  isChecked(node, index, label) {
    return node.value[index].indexOf(label) !== -1;
  }

  toggleChecked(node, index,label) {
    if (this.isChecked(node, index,label)) {
      node.value[index].splice(node.value[index].indexOf(label), 1);
    } else {
      node.value[index].push(label);
    }
  };

  onAVLabelChanges(node: FileNode, index: number, valueLocation: string, value: any) {
    this.changed.emit({'type': 'attribute-value', 'subtype': '','model':node.model,'key':node.key, 'index':index,'location': valueLocation, 'value':value});
 }

  onAVValueChanges(node: FileNode, index: number, valueLocation: string, value: any) {
    this.changed.emit({'type': 'textfield', 'subtype': '','model':node.model,'key':node.model[node.key][index], 'index':index,'location': '@value', 'value':value});
  }

  buildAttributeValueControls(val: any[], formGroup: FormGroup) {
    const arr = [];
    val.forEach((value, i) => {
      const items = [];
      const controlValue = new FormControl({value: value['rdfs:label'], disabled: this.disabled});
      items.push(controlValue);
      const controlLabel = new FormControl({value: value['@value'], disabled: this.disabled});
      items.push(controlLabel);
      const fg = this._fb.group({values: this._fb.array(items)});
      arr.push(fg);
    });
    this.formGroup = this._fb.group({values: this._fb.array(arr)});
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  copyAttributeValue(node: FileNode, index: number) {
    this._ts.copyAttributeValue(node.model, node.key, index);
    const val = this._ts.buildAttributeValues(node.model, node.key);
    this.buildAttributeValueControls(val, this.formGroup);
  }

  removeAttributeValue(node: FileNode, index: number) {
    this._ts.removeAttributeValue(node.model, node.key, index);
    const val = this._ts.buildAttributeValues(node.model, node.key);
    this.buildAttributeValueControls(val, this.formGroup);
  }

  // do you want to filter dates out of the calendar?
  dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  addNewItem() {

    const value = '';
    this.node.value.push(value);
    const control = new FormControl(value, this.getValidators(this.node));
    const fa = this.formGroup.controls.values as FormArray;
    fa.push(control);

    let obj = {};
    obj[this.node.valueLocation] = '';
    this.node.model[this.node.key].push(obj);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  deleteLastItem() {
    const at = this.node.value.length - 1;
    this.node.value.splice(at, 1);
    const fa = this.formGroup.controls.values as FormArray;
    fa.removeAt(fa.length - 1);
    this.node.model[this.node.key].splice(at, 1);
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

  getImageWidth(node:FileNode) {
    let width = 367;
    if (node.size && node.size.width && Number.isInteger(node.size.width)) {
       width=node.size.width;
    }
    return width;
  }

  getImageHeight(node:FileNode) {
    let height = 270;
    if (node.size && node.size.height && Number.isInteger(node.size.height)) {
      height=node.size.height;
    }
    return height;
  }

  getYouTubeEmbedFrame(node:FileNode) {
    var width = 560;
    var height = 315;
    var content:string = node.value[0];
    if (content) {
      content = content.replace(/<(?:.|\n)*?>/gm, '');
    }

    //var size = dms.getSize(field);
    let size;

    if (size && size.width && Number.isInteger(size.width)) {
      width = size.width;
    }
    if (size && size.height && Number.isInteger(size.height)) {
      height = size.height;
    }

    // if I say trust as html, then better make sure it is safe first
    if (content) {
      return
        '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + content + '" frameborder="0" allowfullscreen></iframe>';
    }
  };


}


