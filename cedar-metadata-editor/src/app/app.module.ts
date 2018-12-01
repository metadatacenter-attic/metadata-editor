import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { LOCALE_ID,NgModule } from '@angular/core';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';
import { InstanceModule } from './instance/instance.module';
import { InstanceComponent } from './instance/instance.component';



const appRoutes: Routes = [
  { path: 'instances/create', component: InstanceComponent },
  { path: 'instances/edit/:id', component: InstanceComponent },
  { path: 'instances/create/:templateId', component: InstanceComponent},
  { path: '', redirectTo: 'instances/create', pathMatch: 'full'},
  { path: '**', component: InstanceComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HeaderModule,
    FooterModule,
    InstanceModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
