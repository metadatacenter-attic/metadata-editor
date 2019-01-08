
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DemoMaterialModule} from '../../material-module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { TreeRoutingModule } from './tree-routing.module';
import { TreeComponent } from './tree.component';


@NgModule({
  declarations: [TreeComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    TreeRoutingModule,
    DemoMaterialModule
  ],
  exports: [
    TreeComponent
  ],
  providers: [
  ],
})
export class TreeModule {
}
