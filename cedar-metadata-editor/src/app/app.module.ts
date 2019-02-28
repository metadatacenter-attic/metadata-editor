import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {LOCALE_ID, NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UiService} from './services/ui/ui.service';
import {DemoMaterialModule} from '../material-module';
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DemoMaterialModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}, UiService],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}
