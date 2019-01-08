import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionBase} from './_models/question-base';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  get isValid() {
    let result = false;
    console.log('isValid', this.question, this.question.key, this.form);
    if (this.form.controls.hasOwnProperty(this.question.key)) {
      result = this.form.controls[this.question.key].valid;
    }
    return result;
  } //return this.form.controls[this.question.key].valid; }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }

}


