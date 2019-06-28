import {Component, OnInit} from '@angular/core';
import {UiService} from './services/ui.service';

import {environment} from '../environments/environment';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import {LocalSettingsService} from './services/local-settings.service';
import {faBars, faSquare, faTag} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showMenu = false;
  title: string;
  disabled: boolean = false;
  languages = {
    selected: "en",
    options: [{ value: 'en', viewValue: 'en' }, { value: 'hu', viewValue: 'hu' }]
  };
  _tr: TranslateService;
  _ls: LocalSettingsService;

  faTag = faTag;
  faSquare = faSquare;
  faBars = faBars;

  constructor(public ui: UiService, ls: LocalSettingsService,
              tr: TranslateService,
              titleService: Title) {
    this._tr = tr;
    this._ls = ls;

    // this language will be used as a fallback when a translation isn't found in the current language
    this._tr.setDefaultLang(environment.fallbackLanguage);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    const currentLanguage = this._ls.getLanguage() || environment.defaultLanguage;
    this._tr.use(currentLanguage);
    this.languages.selected = currentLanguage;

    this._tr.onLangChange.subscribe((event: LangChangeEvent) => {
      this.switchLanguage(event.lang);
      this._tr.get('App.WindowTitle').subscribe((res: string) => {
        titleService.setTitle(res);
      });
    });
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  modeToggleSwitch() {
  }

  getCurrentLanguageCode() {
    return this._tr.currentLang;
  }

  switchLanguage(language: string) {
    this._tr.use(language);
    this._ls.setLanguage(language);
  }


}
