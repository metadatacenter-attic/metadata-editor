import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';





@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  providers: [],

})
export class QuestionComponent implements OnInit {
  @Input() questionForm: FormGroup
  @Input() index: number
  @Output() deleteQuestion: EventEmitter<number> = new EventEmitter()


  ngOnInit() {
  }

  delete() {
    this.deleteQuestion.emit(this.index)
  }

  constructor( ) {
  }

}
