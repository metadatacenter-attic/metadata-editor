import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FormComponent} from './form.component';
import {TemplateService} from '../../template.service';
import {QuestionComponent} from './question/question.component';
import {ElementComponent} from './element/element.component';

import {DemoMaterialModule} from '../../../material-module';
import {ControlledComponent} from './controlled/controlled.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class FormModule { }
