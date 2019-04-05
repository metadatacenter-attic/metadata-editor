
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {InstanceRoutingModule} from './instance-routing.module';
import {InstanceComponent} from './instance.component';
import {FormModule} from './form/form.module';

import {DemoMaterialModule} from '../../material-module';


@NgModule({
  declarations: [
    InstanceComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    InstanceRoutingModule,
    DemoMaterialModule,
    FormModule
  ],
  exports: [
    InstanceComponent
  ],
  providers: [],
})
export class InstanceModule {
}
