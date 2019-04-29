import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxYoutubePlayerModule} from 'ngx-youtube-player';

import {SharedModule} from '../../modules/shared/shared.module';
import {DemoMaterialModule} from '../../../material-module';
import {FormComponent} from "./components/form/form.component";
import {QuestionComponent} from "./components/question/question.component";
import {ControlledComponent} from "./components/controlled/controlled.component";
import {ElementComponent} from "./components/element/element.component";


@NgModule({
  declarations: [FormComponent, QuestionComponent, ElementComponent, ControlledComponent],

  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    DemoMaterialModule,
    SharedModule,
    NgxYoutubePlayerModule.forRoot()
  ],
  exports: [
    FormComponent
  ],
  providers: [],
})
export class CedarMetadataFormModule {
}
