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


  }


  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};


    questions.forEach(question => {
      if (question.controlType  == 'textbox') {
        group[question.label] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      } else if (question.controlType  == 'element') {

        group[question.key] = new FormControl(question.key);
      }

    });
    return new FormGroup(group);
  }




}
