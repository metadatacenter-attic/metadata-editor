import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {SharedModule} from './modules/shared';
import {ResourcesModule} from './modules/resources/resources.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UiService} from './services/ui.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {OverlayModule} from "@angular/cdk/overlay";
import {MaterialModule} from "./shared/material-module";


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    SnotifyModule,
    SharedModule,
    ResourcesModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FlexLayoutModule,
    FontAwesomeModule,
    OverlayModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}, UiService,SnotifyService,
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},],

  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
}


