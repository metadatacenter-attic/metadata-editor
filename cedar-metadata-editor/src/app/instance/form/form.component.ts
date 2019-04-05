import {Component, Input, EventEmitter, Output, OnChanges, SimpleChange} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {TemplateService} from './service/template.service';
import {TemplateSchemaService} from './service/template-schema.service';
import {ElementService} from './element/service/element.service';

import {NestedTreeControl} from "@angular/cdk/tree";
import {FileNode} from "./_models/file-node";
import {MatTreeNestedDataSource} from "@angular/material";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {UiService} from "../../services/ui/ui.service";
import * as jsonld from 'jsonld';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'cedar-metadata-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [TemplateService, TemplateSchemaService, ElementService]
})

export class FormComponent implements OnChanges {

  @Input() id: string;
  @Input() viewOnly: boolean;
  @Output() changed = new EventEmitter<any>();

  form: FormGroup;
  treeControl: NestedTreeControl<FileNode>;
  dataSource: MatTreeNestedDataSource<FileNode>;
  database: TemplateService;
  route: ActivatedRoute;
  response:any = {payload:null, jsonLD: null, rdf:null, formValid:false};


  darkMode: boolean;
  private _darkModeSub: Subscription;

  private _subscription: Subscription;

  constructor(private ui: UiService, ts: TemplateService, route: ActivatedRoute) {
    this.database = ts;
    this.route = route;
  }

  changeLog: string[] = [];

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
    this.initialize(this.id);
  }

  private hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  initialize(templateId: string) {

    this.form = new FormGroup({});
    this.onChanges();
    this.response.jsonLD = this.database.initialize(this.form, templateId);

    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    this.response.payload = this.form.value;
    this.response.jsonLD = this.database.model;
    this.response.formValid = this.form.valid;

    // get the rdf before you return everything to parent
    let that = this;
    jsonld.toRDF(this.response.jsonLD, {format: 'application/nquads'}, function (err, nquads) {
      if (err) {
        that.response.rdf = err;
      }  else {
        that.response.rdf = nquads;
      }
      that.changed.emit(that.response);
    });
  }

  getTitle() {
    return this.database.getTitle();
  }

  isDisabled() {
    return this.viewOnly;
  }

  ngAfterViewInit() {
    this.onChanges();
  }

  // keep up-to-date on changes in the form
  onChanges(): void {
    if (this.form) {
      this._subscription = this.form.valueChanges.subscribe(val => {
        this.response.payload = val;
        this.response.jsonLD = this.database.model;
        this.response.formValid = this.form.valid;

        // get the rdf before you return everything to parent
        let that = this;
        // TODO debug delayed jsonLD and RDF changes
        console.log('json 777',JSON.stringify(this.response.jsonLD).indexOf('777'));
        jsonld.toRDF(this.response.jsonLD, {format: 'application/nquads'}, function (err, nquads) {
          that.response.rdf = err ? err : nquads;
          console.log('rdf 777',JSON.stringify(that.response.rdf).indexOf('777'));
          setTimeout(() => {
            that.changed.emit(that.response);
          }, 0);

        });
      });
    }
  }

  // add new element to form
  addNewItem(node: FileNode) {

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
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index, 1);
    this.database.dataChange.next(this.database.data);
    node.parentGroup.removeControl(node.key);
    this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

}

