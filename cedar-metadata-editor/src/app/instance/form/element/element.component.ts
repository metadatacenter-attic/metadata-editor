import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { FormGroup, FormArray }  from '@angular/forms';
import {Subscription} from "rxjs";

import { ElementService } from './service/element.service'
import { QuestionService } from '../service/question.service'
import { QuestionControlService } from '../service/question-control.service'



@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.less'],
  providers: [  ElementService, QuestionService, QuestionControlService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent implements OnInit {
  elementForm: FormGroup
  formSub: Subscription
  formInvalid: boolean = false;
  //questions: FormArray;
  elementGroup: FormGroup;


  constructor(private fs: ElementService) {  }

  ngOnInit() {
    this.formSub = this.fs.elementForm$
      .subscribe(element => {
        this.elementForm = element
        //this.questions = this.elementForm.get('questions') as FormArray
        this.elementGroup = this.elementForm.get('elementGroup') as FormGroup
        //console.log('questions',this.questions)
      })
  }





  addElement() {
    //this.formService.addQuestion(this.elementForm)
  }

  delete() {
    //this.deleteElement.emit(this.key)
  }

}
