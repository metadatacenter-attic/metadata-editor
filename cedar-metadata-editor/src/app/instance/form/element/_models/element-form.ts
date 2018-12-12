import {FormGroup, FormControl, Validators, FormArray} from '@angular/forms'

import { Element } from './element';
import {QuestionBase} from "../../question/_models/question-base";



export class ElementForm {


  name = new FormControl()
  //questions = new FormArray([])
  elementGroup:FormGroup;

  constructor(element: Element) {
    if (element.name) {
      this.name.setValue(element.name)
    }

    if (element.questions) {
      //this.questions = this.toFormArray(template.questions);
      this.elementGroup =  this.toFormGroup(element.questions)

    }
  }

    toFormArray(questions: QuestionBase<any>[] ) {
      let formArray: FormControl[] = new Array<FormControl>();

      console.log('questions',questions)

      questions.forEach(question => {
        if (question.controlType  == 'textbox' ) {
          formArray.push(question.required ? new FormControl(question.value || '', Validators.required)
            : new FormControl(question.value || ''));
        }

      });
      console.log('formArray',formArray)
      return new FormArray(formArray);
    }


  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};
    console.log('toFormGroup')

    questions.forEach(question => {
      if (question.controlType  == 'textbox') {
        group[question.label] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      }

    });
    return new FormGroup(group);
  }


}

