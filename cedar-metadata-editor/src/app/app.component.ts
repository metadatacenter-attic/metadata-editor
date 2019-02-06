
import { Component, OnInit } from '@angular/core';
import { UiService } from './services/ui/ui.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  showMenu = false;
  darkMode: boolean;
  title: string;
  private _subscription: Subscription

  constructor(public ui: UiService) {
    this.title = 'Cedar Metadata Editor';
  }

  ngOnInit() { this._subscription = this.ui.darkModeState$.subscribe(res => {
    this.darkMode = res;
    console.log('received', res);
  })}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  modeToggleSwitch() {
    this.ui.update(!this.darkMode);
    // this.ui.darkModeState.next(!this.darkModeActive);
  }



}
