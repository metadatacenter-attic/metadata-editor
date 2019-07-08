import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from "../shared";
import {MaterialModule} from "../../shared/material-module";
import {InstanceComponent} from "./components/instance/instance.component";
import {MetadataEditorRoutingModule} from "./metadata-editor-routing.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {LegendComponent} from './components/legend/legend.component';

@NgModule({
  declarations: [
    InstanceComponent,
    LegendComponent],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    MetadataEditorRoutingModule,
    MaterialModule,
    SharedModule,
    FontAwesomeModule
  ],
  exports: [
    InstanceComponent
  ],
  providers: [],
})
export class MetadataEditorModule {
}
