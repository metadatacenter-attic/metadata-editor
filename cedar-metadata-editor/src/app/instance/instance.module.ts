import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {InstanceComponent} from './instance.component';
import {FormComponent} from './form/form.component';
import {TemplateService} from '../template.service';
import {FieldComponent} from './form/field/field.component';
import {SectionComponent} from './form/field/section/section.component';
import {RichtextComponent} from './form/field/richtext/richtext.component';
import {YoutubeComponent} from './form/field/youtube/youtube.component';
import {ImageComponent} from './form/field/image/image.component';
import {TextfieldComponent} from './form/field/textfield/textfield.component';
import {DateComponent} from './form/field/date/date.component';
import {EmailComponent} from './form/field/email/email.component';
import {NumberComponent} from './form/field/number/number.component';
import {ListComponent} from './form/field/list/list.component';
import {CheckboxComponent} from './form/field/checkbox/checkbox.component';
import {RadioComponent} from './form/field/radio/radio.component';
import {QuestionComponent} from './form/question/question.component';


@NgModule({
  declarations: [
    InstanceComponent, FormComponent, FieldComponent, SectionComponent, RichtextComponent, YoutubeComponent, ImageComponent, TextfieldComponent, DateComponent, EmailComponent, NumberComponent, ListComponent, CheckboxComponent, RadioComponent, QuestionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,

  ],
  exports: [
    InstanceComponent
  ],
  providers: [
    TemplateService
  ],
})
export class InstanceModule {
}
