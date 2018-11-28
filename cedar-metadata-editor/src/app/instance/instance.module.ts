import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstanceComponent } from './instance.component';
import { FormComponent } from './form/form.component';
import { TemplateService } from '../template.service';


@NgModule({
  declarations: [
    InstanceComponent, FormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InstanceComponent
  ],
  providers: [
    TemplateService
  ],
})
export class InstanceModule { }
