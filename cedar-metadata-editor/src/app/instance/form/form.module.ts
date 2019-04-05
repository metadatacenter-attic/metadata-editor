
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FormComponent} from './form.component';
import {TemplateService} from './service/template.service';
import {ElementService} from './element/service/element.service';
import {QuestionComponent} from './question/question.component';
import {ElementComponent} from './element/element.component';
import {ControlledComponent} from './controlled/controlled.component';





import {DemoMaterialModule} from '../../../material-module';



@NgModule({
  declarations: [FormComponent, QuestionComponent, ElementComponent, ControlledComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    DemoMaterialModule
  ],
  exports: [
    FormComponent
  ],
  providers: [
    TemplateService,
  ],
})
export class FormModule {
}
