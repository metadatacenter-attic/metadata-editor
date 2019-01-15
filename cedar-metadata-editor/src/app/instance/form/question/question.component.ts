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
  formControl: FormControl;
  checkboxGroup:FormGroup;
  radioGroup:FormGroup;
  _fb: FormBuilder;


  constructor(fb:FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    const validators = this.getValidators(this.node);

    if (this.node.type == 'textfield' || this.node.type == 'url' || this.node.type == 'paragraph' || this.node.type == 'email' || this.node.type == 'tel'  || this.node.type == 'number' || this.node.type == 'dropdown' || this.node.type == 'date') {
      this.formControl = new FormControl(this.node.value, validators);
      this.parentForm.addControl(this.node.filename, this.formControl);
    }

    if (this.node.type == 'checkbox') {
      this.checkboxGroup = this._fb.group({
        values: this._fb.array(this.node.value)
      });
      this.parentForm.addControl(this.node.filename, this.checkboxGroup);
    }
    if (this.node.type == 'radio') {
      this.radioGroup = this._fb.group({
        value: this.node.value
      });
      this.parentForm.addControl(this.node.filename, this.radioGroup);
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

  toggle(i:number) {
    if (this.node.type == 'checkbox') {
      this.node.value[i] = !this.node.value[i];
    }
    if (this.node.type == 'radio') {
      this.node.value = this.node.options[i].value;
      this.radioGroup.setValue({value:this.node.value});
    }
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


