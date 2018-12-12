import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

import { TeamFormService } from '../team-form.service'

@Component({
  selector: 'nba-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent implements OnInit {
  @Input() playerForm: FormGroup
  @Input() index: number
  @Output() deletePlayer: EventEmitter<number> = new EventEmitter()

  constructor(private teamFormService: TeamFormService) { }

  ngOnInit() {}

  // addTeam() {
  //   this.teamFormService.addTeam(this.playerForm)
  // }

  delete() {
    this.deletePlayer.emit(this.index)
  }

}
