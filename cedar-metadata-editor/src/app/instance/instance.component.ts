import {Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs'
import { FormGroup }  from '@angular/forms';

import { UiService } from "../services/ui/ui.service";
import { QuestionService } from "./form/service/question.service";
import { QuestionBase } from "./form/question/_models/question-base";

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: [QuestionService]
})

export class InstanceComponent implements OnInit {

  formId:string;
  project:FormGroup;
  title:string;
  questions: [QuestionBase<any>];
  payload:string;

  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService, qs:QuestionService) {
      this.questions = qs.getQuestions('projectForm');
      this.payload = '';
  }

  ngOnInit() {
    this.title = 'Cedar Metadata Editor';
    this.formId = 'projectForm';


    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
    this.darkMode = value;
  })}



}
