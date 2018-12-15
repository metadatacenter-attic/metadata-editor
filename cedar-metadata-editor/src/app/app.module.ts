import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatExpansionModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';


import {LOCALE_ID, NgModule} from '@angular/core';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UiService} from './services/ui/ui.service';


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
    MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatExpansionModule,
    FlexLayoutModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}, UiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
