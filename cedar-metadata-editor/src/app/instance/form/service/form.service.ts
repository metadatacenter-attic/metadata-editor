import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'

import { TemplateForm } from '../_models/template-form'
import { Template } from '../_models/template'
import { Question } from '../question/_models/question'
import { QuestionForm } from '../question/_models/question-form'
import { Element } from '../element/_models/element'
import { ElementForm } from '../element/_models/element-form'
import { QuestionService } from './question.service';
import { QuestionControlService } from './question-control.service';
import { ElementService } from '../element/service/element.service'




@Injectable()
export class FormService {

  private templateForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(this.fb.group(new TemplateForm(new Template(this.qs, 'projectForm', 'project form'))))
  templateForm$: Observable<FormGroup> = this.templateForm.asObservable()



  constructor(private fb: FormBuilder, private es: ElementService, private qs: QuestionService, private qcs: QuestionControlService) {}

  addQuestion() {
    const currentTeam = this.templateForm.getValue()
    const currentPlayers = currentTeam.get('questions') as FormArray
    console.log('currentTeam',currentTeam);
    console.log('currentPlayers',currentPlayers);

    currentPlayers.push(
      this.fb.group(
        new QuestionForm(new Question(this.qs,  'project'))
      )
    )

    this.templateForm.next(currentTeam)
  }


  addElement(formGroup:FormGroup, key:string) {
    console.log('addElement',key);

    this.es.addElement(formGroup,'project');
    const currentTemplate = this.templateForm.getValue()
    this.templateForm.next(currentTemplate)
  }




  deleteQuestion(i: number) {
    const currentTeam = this.templateForm.getValue()
    const currentPlayers = currentTeam.get('questions') as FormArray

    currentPlayers.removeAt(i)

    this.templateForm.next(currentTeam)
  }
}
