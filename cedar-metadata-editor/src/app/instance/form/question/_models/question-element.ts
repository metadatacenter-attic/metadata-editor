import { QuestionBase } from './question-base';
import { FormGroup } from '@angular/forms';


export class ElementQuestion extends QuestionBase<string> {
  formGroup:FormGroup;

  constructor(options: {} ) {
    super(options);

    let group = {};
    this.formGroup = new FormGroup(group);

  }

  get isValid() {
      return this.formGroup ? this.formGroup.valid : false;
  }
}

