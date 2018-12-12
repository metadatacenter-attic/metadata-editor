import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms'

import { Question } from '../../question/_models/question'
import { QuestionForm } from '../../question/_models/question-form'
import { Element } from '../_models/element'
import { ElementForm } from '../_models/element-form'
import { QuestionService } from '../../service/question.service';
import { QuestionControlService } from '../../service/question-control.service';



@Injectable()
export class ElementService {


  private elementForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(this.fb.group(new ElementForm( new Element(this.qs, 'project'))))
  elementForm$: Observable<FormGroup> = this.elementForm.asObservable()

  constructor(private fb: FormBuilder, private qs: QuestionService,private qcs: QuestionControlService) {}



  addElement(formGroup:FormGroup, key:string) {

    let currentElement = this.elementForm.getValue()
    let elementGroup:FormGroup = currentElement.get('elementGroup') as FormGroup

    console.log('currentGroup',elementGroup);

    formGroup.addControl('elementGroup',elementGroup as FormControl);

    this.elementForm.next(currentElement)
  }



  deleteQuestion(i: number) {
    const currentTeam = this.elementForm.getValue()
    const currentPlayers = currentTeam.get('questions') as FormArray

    currentPlayers.removeAt(i)

    this.elementForm.next(currentTeam)
  }
}
