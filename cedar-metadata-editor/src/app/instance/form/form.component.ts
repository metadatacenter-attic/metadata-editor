import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import {FormGroup, FormArray} from '@angular/forms'
import {Subscription} from 'rxjs'

import {FormService} from './service/form.service'
import {ElementService} from './element/service/element.service'

import {QuestionBase} from './question/_models/question-base'
import {QuestionService} from './service/question.service'
import {QuestionControlService} from './service/question-control.service'


@Component({
  selector: 'cedar-form',
  templateUrl: './form.component.html',
  providers: []
})

export class FormComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
  }
}

