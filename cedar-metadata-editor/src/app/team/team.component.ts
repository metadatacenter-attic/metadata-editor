import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormArray } from '@angular/forms'
import { TeamFormService } from './team-form.service'
import { Subscription } from 'rxjs'
import {UiService} from "../services/ui/ui.service";



@Component({
  selector: 'nba-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.less']
})
export class TeamComponent implements OnInit, OnDestroy {
  teamForm: FormGroup
  teamFormSub: Subscription
  formInvalid: boolean = false;
  players: FormArray;


  darkMode: boolean;

  private _subscription: Subscription

  constructor(private ui: UiService,private teamFormService: TeamFormService) {
  }

  ngOnInit() {
    this.teamFormSub = this.teamFormService.teamForm$
      .subscribe(team => {
        console.log('next teamForm',team)
        this.teamForm = team
        this.players = this.teamForm.get('players') as FormArray
      })

    this._subscription = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    })}


  // constructor(private teamFormService: TeamFormService) { }
  //
  // ngOnInit() {
  //   this.teamFormSub = this.teamFormService.teamForm$
  //     .subscribe(team => {
  //       console.log('next teamForm',team)
  //       this.teamForm = team
  //       this.players = this.teamForm.get('players') as FormArray
  //     })
  // }




  ngOnDestroy() {
    this.teamFormSub.unsubscribe()
  }

  addPlayer() {
    this.teamFormService.addPlayer()
  }

  deletePlayer(index: number) {
    this.teamFormService.deletePlayer(index)
  }

  saveTeam() {
    console.log('team saved!')
    console.log(this.teamForm.value)
  }
}
