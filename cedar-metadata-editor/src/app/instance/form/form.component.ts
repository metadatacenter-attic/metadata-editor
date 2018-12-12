import { Component, Input,OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormArray } from '@angular/forms'
import { Subscription } from 'rxjs'

import { FormService } from './service/form.service'
import { ElementService } from './element/service/element.service'

import { QuestionService } from './service/question.service'
import { QuestionControlService } from './service/question-control.service'



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [  FormService, ElementService, QuestionService, QuestionControlService ]
})

export class FormComponent implements OnInit {
  templateForm: FormGroup
  formSub: Subscription
  formInvalid: boolean = false;
  //questions: FormArray;
  templateGroup: FormGroup;


  constructor(private fs: FormService, private es: ElementService) {  }

  ngOnInit() {
    this.formSub = this.fs.templateForm$
      .subscribe(template => {
        console.log('next templage',template)
        this.templateForm = template
        //this.questions = this.templateForm.get('questions') as FormArray
        this.templateGroup = this.templateForm.get('templateGroup') as FormGroup
      })
  }

  addQuestion() {
    this.fs.addQuestion()
  }

  addElement() {
    this.fs.addElement(this.templateForm,'project')
  }

  deleteQuestion(index: number) {
    this.fs.deleteQuestion(index)
  }

  deleteElement(index: number) {
    //this.es.deleteElement(index)
  }

  saveTeam() {
    console.log('team saved!')
    console.log(this.templateForm.value)
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

  onSubmit() {
    console.log('onSubmit',this.templateGroup.value, this.templateGroup.status, this.templateForm.value, this.templateForm.status);
  }

}
