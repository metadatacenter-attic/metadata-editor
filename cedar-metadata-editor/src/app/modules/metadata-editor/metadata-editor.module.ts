
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from "../shared";
import {DemoMaterialModule} from "../../../material-module";
import {InstanceComponent} from "./components/instance/instance.component";
import {MetadataEditorRoutingModule} from "./metadata-editor-routing.module";
import {CedarMetadataFormModule} from "../cedar-metadata-form/cedar-metadata-form.module";

@NgModule({
  declarations: [
    InstanceComponent],


  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    MetadataEditorRoutingModule,
    DemoMaterialModule,
    SharedModule,
    CedarMetadataFormModule
  ],
  exports: [
    InstanceComponent
  ],
  providers: [],
})
export class MetadataEditorModule {
}
