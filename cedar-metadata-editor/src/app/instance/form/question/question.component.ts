import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';

import {FileNode} from "../../instance.component";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class QuestionComponent implements OnInit {
  @Input() node: FileNode;
  @Input() parentForm: FormGroup;


  radioGroup:FormGroup[];

  formGroup:FormGroup;



  _fb: FormBuilder;


  constructor(fb:FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {

    const validators = this.getValidators(this.node);

    if (this.node.type == 'textfield' || this.node.type == 'paragraph' ||  this.node.type == 'dropdown' ) {

      // build the controls
      let arr = [];
      this.node.value.values.forEach((value, i) => {
        let control = new FormControl(value, validators);
        arr.push(control);
      });

      // build the array of controls and add it to the parent
      this.formGroup = this._fb.group({values: this._fb.array(arr)});
      this.parentForm.addControl(this.node.filename , this.formGroup);
    }

    if (this.node.type == 'date') {

      // build the controls
      let arr = [];
      this.node.value.values.forEach((value, i) => {
        let control = new FormControl(new Date(value), validators);
        arr.push(control);
      });

      this.formGroup = this._fb.group({values: this._fb.array(arr)});
      this.parentForm.addControl(this.node.filename , this.formGroup);
    }

    if (this.node.type == 'radio') {

      let arr = [];
      this.node.value.values.forEach((item, index) => {
        let obj = {};
        obj[this.node.filename + index] = this.node.value.values[index];
        let control = new FormControl(this.node.value.values[index]);
        arr.push(control);
      });
      this.formGroup = this._fb.group({values: this._fb.array(arr)});
      this.parentForm.addControl(this.node.filename , this.formGroup);

    }

    if (this.node.type == 'checkbox') {

      // build the controls
      let arr = [];
      this.node.value.values.forEach((value, i) => {

        let  controls = [];
        this.node.options.forEach ((opt,  j) => {
          let control =  new FormControl(value[j]);
          controls.push(control);
        });
        let group = this._fb.group({
          values: this._fb.array(controls)});
        arr.push(group);
      });

      this.formGroup = this._fb.group({values: this._fb.array(arr)});
      this.parentForm.addControl(this.node.filename , this.formGroup);

    }


  }


  getValidators(node:FileNode) {
    let validators = [];
    if (this.node.required) {
      validators.push(Validators.required);
    }
    if (this.node.type == 'email') {
      validators.push(Validators.email);
    }
    if (this.node.min !== null) {
      validators.push(Validators.min(this.node.min));
    }
    if (this.node.max !== null) {
      validators.push(Validators.max(this.node.max));
    }
    if (this.node.minLength !== null) {
      validators.push(Validators.minLength(this.node.minLength));
    }
    if (this.node.maxLength !== null) {
      validators.push(Validators.maxLength(this.node.maxLength));
    }
    if (this.node.pattern !== null) {
      validators.push(Validators.pattern(this.node.pattern));
    }
    if (this.node.type == 'url') {
      validators.push(this.validateUrl);
    }
    return validators;
  }

  validateUrl(control: FormControl) {
    let result = null;
    if (!control.value.startsWith('http')) {
      result = {'url':true};
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

    if (this.parentForm && this.parentForm.controls.hasOwnProperty(this.node.filename)) {
      result = this.parentForm.controls[this.node.filename].valid;
    }
    return result;
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

}


