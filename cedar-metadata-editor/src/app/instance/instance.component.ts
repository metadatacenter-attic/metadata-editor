import {Component, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from "../services/ui/ui.service";

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: []
})

export class InstanceComponent implements OnInit {
  form: FormGroup;
  route: ActivatedRoute;
  payload: any;
  jsonLD: any;
  rdf: any;
  id: string;
  formValid: boolean;
  viewOnly: boolean = false;
  ui: UiService;

  darkMode: boolean;
  private _darkModeSub: Subscription;


  constructor(ui: UiService, route: ActivatedRoute) {
    this.route = route;
    this.ui = ui;
  }

  ngOnInit() {
    this.route.params.subscribe((val) => {
      this.id = val.templateId;
    });

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

  // form changed, update tab contents and submit button status
  protected onChanged(event) {
    const e = event;
    setTimeout(() => {
      this.payload = e.payload;
      this.jsonLD = e.jsonLD;
      this.rdf = e.rdf;
      this.formValid = e.formValid;
      //TODO debug rdf change delay
      //console.log('777',JSON.stringify(this.rdf).indexOf('777'));
    }, 0);
  }

  // toggle edit/view button
  toggleDisabled() {
    this.viewOnly = !this.viewOnly;
  }

  // copy stuff in tabs to browser's clipboard
  copyToClipboard(elementId: string, buttonId: string) {

    function copyToClip(str) {
      function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
      }

      document.addEventListener("copy", listener);
      document.execCommand("copy");
      document.removeEventListener("copy", listener);
    }

    let elm = document.getElementById(elementId);
    let data = elm ? elm.innerHTML : null;
    if (data) {

      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = data;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      copyToClip(data);
      document.body.removeChild(selBox);

      let btn = document.getElementById(buttonId);
      if (btn) {
        btn.innerHTML = 'Copied';
        setTimeout(() => {
          let btn = document.getElementById(buttonId);
          if (btn) {
            btn.innerHTML = 'Copy';
          }
        }, 10000);
      }
    }
  }

  onSubmit() {
    console.log('onSubmit')
  }


}
