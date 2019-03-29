import {Component, Injectable, OnInit} from '@angular/core';
//import { NgModule } from '@angular/core';

import {Subscription} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {ActivatedRoute} from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';

import {UiService} from '../services/ui/ui.service';
import {FileNode} from './_models/file-node';
import {TemplateSchemaService} from './_service/template-schema.service';
import {TemplateService} from './_service/template.service';
import * as jsonld from 'jsonld';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: [TemplateService, TemplateSchemaService]
})

export class InstanceComponent implements OnInit {
  treeControl: NestedTreeControl<FileNode>;
  dataSource: MatTreeNestedDataSource<FileNode>;
  database: TemplateService;
  form: FormGroup;
  route: ActivatedRoute;
  payload: any;
  jsonLD: any;
  rdf: any;
  id: number;
  formInvalid: boolean;

  darkMode: boolean;
  private _darkModeSub: Subscription;

  private _subscription: Subscription;
  viewOnly: boolean = false;

  constructor(private ui: UiService, ts: TemplateService, route: ActivatedRoute) {
    this.database = ts;
    this.route = route;
  }

  ngOnInit() {
    this.route.params.subscribe((val) => {
      console.log('route params', val);
      // got a new route, initialize new template and model by id
      this.initialize(val.templateId);
    });

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

  private hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  initialize(templateId: string) {

    this.form = new FormGroup({});
    this.jsonLD = this.database.initialize(this.form, templateId);
    this.getRDF();
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    setTimeout(() => {
      this.payload = this.form.value;
      this.formInvalid = !this.form.valid
    }, 0);
  }

  toggleDisabled() {
    this.viewOnly =  !this.viewOnly;
  }

  isDisabled() {
    return this.viewOnly;
  }

  private getRDF() {
    let that = this;
    jsonld.toRDF(this.jsonLD, {format: 'application/nquads'}, function (err, nquads) {
      if (err) {
        console.log('err', err);
      }
      that.rdf = nquads;
      return nquads;
    });
  }

  ngAfterViewInit() {
    this.onChanges();
  }

  // keep up-to-date on changes in the form
  onChanges(): void {
    if (this.form) {
      this._subscription = this.form.valueChanges.subscribe(val => {
        this.payload = val;
        this.jsonLD = this.database.model;
        this.getRDF();
        setTimeout(() => {
          this.formInvalid = !this.form.valid;
        }, 0);
      });
    }
  }

  // not in use at this time
  // cloneAbstractControl(control: AbstractControl) {
  //   let newControl: AbstractControl;
  //
  //   if (control instanceof FormGroup) {
  //     const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
  //     const controls = control.controls;
  //
  //     Object.keys(controls).forEach(key => {
  //       formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
  //     });
  //
  //     newControl = formGroup;
  //   } else if (control instanceof FormArray) {
  //     const formArray = new FormArray([], control.validator, control.asyncValidator);
  //
  //     control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)))
  //
  //     newControl = formArray;
  //   } else if (control instanceof FormControl) {
  //     newControl = new FormControl(control.value, control.validator, control.asyncValidator);
  //   } else {
  //     throw 'Error: unexpected control value';
  //   }
  //
  //   if (control.disabled) {
  //     newControl.disable({emitEvent: false});
  //   }
  //
  //   return newControl;
  // }

  // not in use at this time
  walkTree(node: FileNode, formGroup: FormGroup, parent: FileNode) {

    if (node.children) {
      console.log('key', node.key, 'element', node.formGroup);
      node.children.forEach((item, index) => {
        item.parent = node;
        item.name += index;
        item.formGroup = formGroup;
        this.walkTree(item, item.formGroup, node);
      });
    } else {
      node.parent = parent;
      console.log('key', node.key, 'formGroup', node.formGroup, 'parent', node.parent);
    }
  }

  // add new element to form
  addNewItem(node: FileNode) {
    console.log('addNewItem', node);

    const clonedObject: FileNode = cloneDeep(node);
    clonedObject.itemCount++;
    clonedObject.key += clonedObject.itemCount;
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index + 1, 0, clonedObject);

    clonedObject.parentGroup = node.parentGroup;
    const parent = node.parentGroup || this.form;
    parent.addControl(clonedObject.key, clonedObject.formGroup);

    this.database.dataChange.next(this.database.data);
    this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  // delete last element in node array
  deleteLastItem(node: FileNode) {
    console.log('deleteLastItem', node);
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index, 1);
    this.database.dataChange.next(this.database.data);
    node.parentGroup.removeControl(node.key);
    this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  onSubmit(value: any,) {
    this.payload = this.form.value;
  }

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
    };

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


}
