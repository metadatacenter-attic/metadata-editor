import {FormArray, FormGroup,FormControl, Validators} from '@angular/forms'

import { Template } from './template'
import {QuestionBase} from "../question/_models/question-base";


export class TemplateForm {
  name = new FormControl()
  //questions = new FormArray([])
  templateGroup:FormGroup;


  constructor(template: Template) {
    if (template.name) {
      this.name.setValue(template.name)
    } templateGroup:FormGroup;

    if (template.questions) {
      //this.questions = this.toFormArray(template.questions);
      this.templateGroup =  this.toFormGroup(template.questions)

    }
    console.log('template group', this.templateGroup);
  }


  toFormArray(questions: QuestionBase<any>[] ) {
    let formArray: FormControl[] = new Array<FormControl>();
    let group: {};

    questions.forEach(question => {
      if (question.controlType  == 'textbox' ) {
        let formControl = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
        formArray.push(formControl);
      }

    });
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
