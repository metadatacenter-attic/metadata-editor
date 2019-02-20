import {Component, EventEmitter, Input, OnInit, AfterViewInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl} from '@angular/forms';

import {FileNode} from '../../_models/file-node';
import {ControlledTermService} from '../../_service/controlled-terms.service';
import {InputType, InputTypeService} from '../../_models/input-types';
import {Post} from "../../_models/post";
import {ControlledComponent} from '../controlled/controlled.component';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  formGroup: FormGroup;
  _fb: FormBuilder;
  it: InputTypeService;

  selectable = true;
  removable = true;

  _ct: ControlledTermService;
  post: Post[];
  controlled: ControlledComponent;

  constructor( fb: FormBuilder, ct: ControlledTermService) {
    this._fb = fb;
    this._ct = ct;
    this.it = new InputTypeService();
  }

  ngAfterViewInit() {
    switch (this.node.type) {
      case InputType.controlled:
        this.controlled.setValue(this.node.value);
        break;
    }
  }

  ngOnInit() {
    this._ct.getPosts().subscribe(posts => {
      this.post = posts
      this._ct.postsData = posts
    });

    // build the array of controls and add it to the parent
    const validators = this.getValidators(this.node);
    const arr = [];

    switch (this.node.type) {
      case InputType.controlled:
        this.controlled = new ControlledComponent(this._ct);
        arr.push(this.controlled.myControl);
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case InputType.textfield:
      case InputType.textarea:
      case InputType.list:
        this.node.value.forEach((value, i) => {
          const control = new FormControl(value, validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case InputType.date:
        this.node.value.forEach((value, i) => {
          const control = new FormControl(new Date(value), validators);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case InputType.radio:
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          const control = new FormControl(this.node.value[index]);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case InputType.checkbox:
        this.node.value.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value[index];
          const control = new FormControl(this.node.value[index]);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
    }
  }


  protected onSelectedOption(e) {
    console.log('onSelectedOption',this.node.key, e);
  }


  isChecked (node, label) {
    return node.value[0].indexOf(label) !== -1;
  }

  setChecked(node, label) {
    if (this.isChecked(node,label)) {
      node.value[0].splice(node.value[0].indexOf(label), 1);
    } else {
      node.value[0].push(label);
    }
  };

  allowsMultiple(type:InputType) {
    return this.it.allowsMultiple(type);
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
    if (node.decimals) {
      validators.push(this.decimalValidator);
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

  decimalValidator(decimal: FormControl) {
    let result = null;
    if (decimal.value) {
      console.log('decimal',decimal.value);
      result = {
        decimal: true
      };
    }
    return result;
  }

  urlValidator(url:FormControl): any {
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

  dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  get isValid() {
    let result = false;

    if (this.parentGroup && this.parentGroup.controls.hasOwnProperty(this.node.key)) {
      result = this.parentGroup.controls[this.node.key].valid;
    }
    return result;
  }

  onChange(node: FileNode, val) {
    console.log('onChange', node, val);
  }

  addNewItem() {

    const value = '';
    this.node.value.push(value);
    const control = new FormControl(value, this.getValidators(this.node));
    const fa = this.formGroup.controls.values as FormArray;
    fa.push(control);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  deleteLastItem() {
    this.node.value.splice(this.node.value.length - 1, 1);
    const fa = this.formGroup.controls.values as FormArray;
    fa.removeAt(fa.length - 1);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

}


