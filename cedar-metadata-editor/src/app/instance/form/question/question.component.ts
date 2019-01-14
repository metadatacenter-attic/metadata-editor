import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import {QuestionBase} from './_models/question-base';
import {ElementQuestion} from './_models/question-element';
import {TextboxQuestion} from './_models/question-textbox';
import {UiService} from "../../../services/ui/ui.service";
import {QuestionService} from "../service/question.service";
import {QuestionControlService} from "../service/question-control.service";
import {Player, PlayerForm} from "../../../team/player";
import {FileNode} from "../../instance.component";


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {
  @Input() node: FileNode;
  @Input() parentForm: FormGroup;
  formControl: FormControl;
  question: QuestionBase<any>;


  constructor() {
  }

  ngOnInit() {
    const base = this.node.type;
    this.question = new TextboxQuestion(this.node);
    this.formControl = new FormControl(this.node.value);
    this.parentForm.addControl(this.node.filename, this.formControl);
  }

  get isValid() {
    let result = false;

    if (this.parentForm && this.parentForm.controls.hasOwnProperty(this.node.filename)) {
      result = this.parentForm.controls[this.node.filename].valid;
    }
    return result;
  } //return this.form.controls[this.question.key].valid; }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

}


