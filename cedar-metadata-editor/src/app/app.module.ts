import {BrowserModule} from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';


import {LOCALE_ID, NgModule} from '@angular/core';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HeaderModule} from './header/header.module';
import {FooterModule} from './footer/footer.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HeaderModule,
    FooterModule,
    AppRoutingModule,
    MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule,MatPaginatorModule,
    FlexLayoutModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
