import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxYoutubePlayerModule} from 'ngx-youtube-player';

import {SharedModule} from '../../modules/shared/shared.module';
import {FormComponent} from './components/form/form.component';
import {QuestionComponent} from './components/question/question.component';
import {ControlledComponent} from './components/controlled/controlled.component';
import {DateComponent} from './components/date/date.component';

import {ElementComponent} from './components/element/element.component';
import {TextfieldComponent} from './components/textfield/textfield.component';
import {TextareaComponent} from './components/textarea/textarea.component';
import {ListComponent} from './components/list/list.component';
import {RadioComponent} from './components/radio/radio.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {AttributeValueComponent} from './components/attribute-value/attribute-value.component';
import {YoutubeComponent} from './components/youtube/youtube.component';
import {SectionComponent} from './components/section/section.component';
import {ImageComponent} from './components/image/image.component';
import {RichtextComponent} from './components/richtext/richtext.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DemoMaterialModule} from "../../../material-module";
import { TooltipDirective } from './components/tooltip/tooltip.directive';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import {OverlayModule} from "@angular/cdk/overlay";

@NgModule({
  declarations: [FormComponent, QuestionComponent, ElementComponent, ControlledComponent,
    DateComponent, TextfieldComponent, TextareaComponent, ListComponent, RadioComponent,
    CheckboxComponent, AttributeValueComponent, YoutubeComponent, SectionComponent, ImageComponent,
    RichtextComponent,TooltipDirective,
    TooltipComponent,],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    DemoMaterialModule,
    SharedModule,
    NgxYoutubePlayerModule.forRoot(),
    FontAwesomeModule,
    OverlayModule,
  ],
  exports: [
    FormComponent
  ],
  entryComponents: [
    TooltipComponent
  ],
  providers: [],
})
export class CedarMetadataFormModule {
}
