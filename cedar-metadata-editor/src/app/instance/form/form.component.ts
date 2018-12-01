import {Component, OnInit, Input} from '@angular/core';

import { FormGroup }                 from '@angular/forms';

import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';

import { InstanceComponent } from '../instance.component';
import { FormService } from '../../form.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [ QuestionControlService ]
})

export class FormComponent implements OnInit {
  // @Input() instanceComponent: InstanceComponent;
  // @Input('form') form: object;
  // @Input('model') model: object;
  // @Input('page') page: number;

  @Input() questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';

  // title: string;
  // pages: object;
  // const: object;
  // pageIndex: number;
  //
  //
  //


  constructor(private qcs: QuestionControlService) {  }



  ngOnInit() {
    // this.title = 'Metadata Editor';
    //
    // this.formService.parseForm(this.formService.propertiesOf(this.form), this.model);
    //
    // this.pages = this.formService.paginate(this.form);
    // this.pageIndex = 0;
    // console.log('pages.order', this.pages['order'])

    this.form = this.qcs.toFormGroup(this.questions);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.value);
  }

  // getLabel = this.formService.getLabel;
  // getTitle = this.formService.getTitle;
  //
  // pageTitle(index) {
  //   return this.pages['title'][index];
  // };

}
