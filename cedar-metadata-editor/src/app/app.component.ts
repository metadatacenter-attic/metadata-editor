
import { Component, OnInit } from '@angular/core';
import { UiService } from './services/ui/ui.service';
import { Subscription } from 'rxjs';


import {environment} from '../environments/environment';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {LocalSettingsService} from './services/local-settings.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  showMenu = false;
  darkMode: boolean;
  title: string;
  private _subscription: Subscription;
  disabled: boolean = false;

  constructor(public ui: UiService, localSettings: LocalSettingsService,
              translate: TranslateService,
              titleService: Title) {
    this.title = 'Cedar Metadata Editor';
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(environment.fallbackLanguage);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let currentLanguage = localSettings.getLanguage();
    if (currentLanguage == null) {
      currentLanguage = environment.defaultLanguage;
    }
    translate.use(currentLanguage);

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      translate.get('App.WindowTitle').subscribe((res: string) => {
        titleService.setTitle(res);
      });
    });
  }


  ngOnInit() { this._subscription = this.ui.darkModeState$.subscribe(res => {
    this.darkMode = res;
  })}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  modeToggleSwitch() {
    this.ui.update(!this.darkMode);
    // this.ui.darkModeState.next(!this.darkModeActive);
  }



}
