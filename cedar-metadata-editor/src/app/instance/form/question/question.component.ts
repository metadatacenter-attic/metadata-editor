import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {QuestionBase} from '../question-base';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  addElement(questions) {
    console.log('addElement with questions',questions);

  }
}
