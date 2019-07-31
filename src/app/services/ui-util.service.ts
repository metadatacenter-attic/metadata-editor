import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiUtilService {
  status:string;
  version:string;
  name:string;

  constructor() { }

  setTemplate(status, version, name) {
    this.status = status;
    this.version = version;
    this.name = name;
  }
}
