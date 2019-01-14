import {Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core'
import {FormGroup, FormArray} from '@angular/forms';
import {Subscription} from "rxjs";

import {ElementService} from './service/element.service'
import {QuestionService} from '../service/question.service'
import {QuestionControlService} from '../service/question-control.service'
import {QuestionBase} from "../question/_models/question-base";
import {UiService} from "../../../services/ui/ui.service";
import {FormService} from "../service/form.service";
import {FileNode} from "../../instance.component";


@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.less'],
  providers: [ FormService, ElementService, QuestionService, QuestionControlService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent {
  @Input() parentForm: FormGroup;
  @Input() elementForm: FormGroup;
  @Input() node: FileNode;


  darkMode:boolean;
  private _darkModeSub: Subscription;

  constructor(private ui:UiService, qs: QuestionService, qcs:QuestionControlService) {


  }

  ngOnInit() {
    this.parentForm.addControl(this.node.filename, this.elementForm);

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

  loadForm() {
    console.log('loadForm');
  }
}
