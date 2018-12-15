import {Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core'
import {FormGroup, FormArray} from '@angular/forms';
import {Subscription} from "rxjs";

import {ElementService} from './service/element.service'
import {QuestionService} from '../service/question.service'
import {QuestionControlService} from '../service/question-control.service'
import {QuestionBase} from "../question/_models/question-base";
import {UiService} from "../../../services/ui/ui.service";
import {FormService} from "../service/form.service";





@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.less'],
  providers: [ FormService, ElementService, QuestionService, QuestionControlService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent {
  @Input() key: string;
  @Input() parent: FormGroup;
  darkMode:boolean;
  private _darkModeSub: Subscription;

  form: FormGroup;
  title:string;
  questions: [QuestionBase<any>];
  qs:QuestionService;
  qcs:QuestionControlService;
  payLoad = '';




  constructor(private ui:UiService, qs: QuestionService, qcs:QuestionControlService) {
    this.qs = qs;
    this.qcs = qcs;
  }

  ngOnInit() {
    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    })
  }

  loadForm() {
    console.log('loadForm',this.key, this.parent);
    this.questions = this.qs.getQuestions(this.key);

    this.form = this.qcs.toFormGroup(this.questions);



    this.parent.setControl(this.key, this.form);
    console.log('parent',this.parent);
  }
}
