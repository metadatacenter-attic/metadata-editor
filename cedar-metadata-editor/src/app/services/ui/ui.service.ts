import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';



@Injectable()
export class UiService {

  _darkModeState: BehaviorSubject<boolean>;
  darkModeState$: Observable<boolean>;

  constructor() {
    // TODO: if the user is signed in get the default value from Firebase
    this._darkModeState = new BehaviorSubject<boolean>(false);
    this.darkModeState$ = this._darkModeState.asObservable();


  }

  public update(action) {
    this._darkModeState.next(action)
    console.log('update',action);
  }

  // get darkMode() {
  //   return this._darkModeState.asObservable();
  // }

  // start() {
  //   this.darkModeState$.subscribe(value =>
  //     this._darkModeState = value
  //   );
  // }

}
