import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import {FormGroup, FormArray} from '@angular/forms'
import {Subscription} from 'rxjs'

import {FormService} from './service/form.service'
import {ElementService} from './element/service/element.service'

import {QuestionBase} from './question/_models/question-base'
import {QuestionService} from './service/question.service'
import {QuestionControlService} from './service/question-control.service'


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [FormService, ElementService, QuestionService, QuestionControlService]
})

export class FormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] = [];
  @Input() form: FormGroup;
  payload: string;
  
  constructor(private qcs: QuestionControlService) {
  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payload = this.form.value;
  }
}

