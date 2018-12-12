import {FormGroup, FormControl, Validators} from '@angular/forms'

import { Question } from './question'
import { QuestionBase } from './question-base'


export class QuestionForm {

  firstName = new FormControl()
  lastName = new FormControl()
  position = new FormControl()
  number = new FormControl()

  constructor(question: Question) {


    this.firstName.setValue('first')
    this.firstName.setValidators([Validators.required])

    this.lastName.setValue('last')

    this.position.setValue('starter')

    this.number.setValue(1)
    this.number.setValidators([Validators.required])
  }


}
