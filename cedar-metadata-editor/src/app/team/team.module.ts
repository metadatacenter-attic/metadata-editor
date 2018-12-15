
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule, MatCheckboxModule} from '@angular/material';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { TeamRoutingModule } from './team-routing.module';
import {TeamComponent} from './team.component';
import {PlayerComponent} from './player/player.component';
import {TeamFormService} from './team-form.service';


@NgModule({
  declarations: [
    TeamComponent, PlayerComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    TeamRoutingModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  exports: [
    TeamComponent
  ],
  providers: [
    TeamFormService
  ],
})
export class TeamModule {
}
