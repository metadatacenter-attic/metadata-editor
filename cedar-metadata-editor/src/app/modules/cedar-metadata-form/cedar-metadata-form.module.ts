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
import {DateComponent} from "./components/date/date.component";

import {ElementComponent} from "./components/element/element.component";
import {TextfieldComponent} from "./components/textfield/textfield.component";
import {TextareaComponent} from "./components/textarea/textarea.component";
import {ListComponent} from "./components/list/list.component";
import {RadioComponent} from "./components/radio/radio.component";
import {CheckboxComponent} from "./components/checkbox/checkbox.component";
import {AttributeValueComponent} from "./components/attribute-value/attribute-value.component";


@NgModule({
  declarations: [FormComponent, QuestionComponent, ElementComponent, ControlledComponent, DateComponent, TextfieldComponent, TextareaComponent, ListComponent, RadioComponent, CheckboxComponent, AttributeValueComponent],

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
