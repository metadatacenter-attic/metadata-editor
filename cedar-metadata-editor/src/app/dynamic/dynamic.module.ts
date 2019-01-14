import { ReactiveFormsModule }          from '@angular/forms';
import { NgModule }                     from '@angular/core';

import { DynamicComponent }                 from './dynamic.component';
import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { DynamicRoutingModule } from './dynamic-routing.module';
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {DemoMaterialModule} from "../../material-module";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    DynamicRoutingModule,
    DemoMaterialModule
  ],
  declarations: [ DynamicComponent, DynamicFormComponent, DynamicFormQuestionComponent ],
  bootstrap: [ DynamicComponent ]
})
export class DynamicModule {
  constructor() {}
}


