
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {InstanceRoutingModule} from './instance-routing.module';
import {InstanceComponent} from './instance.component';
import {FormComponent} from './form/form.component';
import {TemplateService} from '../template.service';
import {QuestionComponent} from './form/question/question.component';
import {ElementComponent} from './form/element/element.component';

import {DemoMaterialModule} from '../../material-module';


@NgModule({
  declarations: [
    InstanceComponent, FormComponent,  QuestionComponent, ElementComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    InstanceRoutingModule,
    DemoMaterialModule
  ],
  exports: [
    InstanceComponent
  ],
  providers: [
    TemplateService,
  ],
})
export class InstanceModule {
}
