import { Injectable }   from '@angular/core';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import {QuestionBase} from "../components/question/_models/question-base";




@Injectable()
export class QuestionControlService {
  constructor() { }

  toFormGroup(questions: QuestionBase<any>[] ) {
    let group: any = {};

    questions.forEach(question => {
      if (question.controlType  == 'element') {

        group[question.key] =  new FormGroup({});
      } else  if (question.controlType  == 'textbox' || question.controlType  == 'dropdown') {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      }

    });
    return new FormGroup(group);
  }

  toFormArray(questions: QuestionBase<any>[] ) {
    let formArray: FormControl[] = new Array<FormControl>();

    console.log('questions',questions)

    questions.forEach(question => {
      if (question.controlType  == 'textbox' ) {
        formArray.push(question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || ''));
      }

    });
    console.log('formArray',formArray)
    return new FormArray(formArray);
  }

  // addPlayer() {
  //   const currentTeam = this.teamForm.getValue()
  //   const currentPlayers = currentTeam.get('players') as FormArray
  //   console.log('currentTeam',currentTeam);
  //   console.log('currentPlayers',currentPlayers);
  //
  //   currentPlayers.push(
  //     this.fb.group(
  //       new PlayerForm(new Player())
  //     )
  //   )
  //
  //   this.teamForm.next(currentTeam)
  // }
  //
  // deletePlayer(i: number) {
  //   const currentTeam = this.teamForm.getValue()
  //   const currentPlayers = currentTeam.get('players') as FormArray
  //
  //   currentPlayers.removeAt(i)
  //
  //   this.teamForm.next(currentTeam)
  // }
}
