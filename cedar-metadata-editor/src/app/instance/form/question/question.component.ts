import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, FormArray, Validators, FormControl} from '@angular/forms';

import {FileNode} from '../../_models/file-node';



@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class QuestionComponent implements OnInit {
  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  formGroup: FormGroup;
  _fb: FormBuilder;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {

    const validators = this.getValidators(this.node);
    const arr = [];

    switch (this.node.type) {
      case 'textfield':
      case 'paragraph':
      case 'list':
        this.node.value.values.forEach((value, i) => {
          const control = new FormControl(value, validators);
          arr.push(control);
        });

        // build the array of controls and add it to the parent
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case 'date':
        this.node.value.values.forEach((value, i) => {
          const control = new FormControl(new Date(value), validators);
          arr.push(control);
        });

        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case 'radio':
        this.node.value.values.forEach((item, index) => {
          const obj = {};
          obj[this.node.key + index] = this.node.value.values[index];
          const control = new FormControl(this.node.value.values[index]);
          arr.push(control);
        });
        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
      case 'checkbox':
        this.node.value.values.forEach((value, i) => {

          const controls = [];
          this.node.options.forEach((opt, j) => {
            const control = new FormControl(value[j]);
            controls.push(control);
          });
          const group = this._fb.group({
            values: this._fb.array(controls)
          });
          arr.push(group);
        });

        this.formGroup = this._fb.group({values: this._fb.array(arr)});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;
    }
  }


  getValidators(node: FileNode) {
    const validators = [];
    if (node.required) {
      validators.push(Validators.required);
    }
    if (node.type === 'email') {
      validators.push(Validators.email);
    }
    if (node.min !== null) {
      validators.push(Validators.min(node.min));
    }
    if (node.max !== null) {
      validators.push(Validators.max(node.max));
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
    if (node.type === 'url') {
      validators.push(this.validateUrl);
    }
    return validators;
  }

  validateUrl(control: FormControl) {
    let result = null;
    if (!control.value.startsWith('http')) {
      result = {'url': true};
    }
    return result;
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
    this.node.value.values.push(value);
    const control = new FormControl(value, this.getValidators(this.node));
    const fa = this.formGroup.controls.values as FormArray;
    fa.push(control);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  deleteLastItem() {
    this.node.value.values.splice(this.node.value.values.length - 1, 1);
    const fa = this.formGroup.controls.values as FormArray;
    fa.removeAt(fa.length - 1);

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

}


