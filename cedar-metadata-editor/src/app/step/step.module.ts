import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {DemoMaterialModule} from '../../material-module';

import { StepRoutingModule } from './step-routing.module';
import { StepperComponent } from './stepper/stepper.component';

@NgModule({
  declarations: [StepperComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    StepRoutingModule
  ]
})
export class StepModule { }
