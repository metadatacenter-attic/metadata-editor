import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatTreeNestedDataSource, PageEvent} from '@angular/material';
import {NestedTreeControl} from "@angular/cdk/tree";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";

import * as jsonld from 'jsonld';
import * as cloneDeep from 'lodash/cloneDeep';
import {TemplateParserService} from "../../services/template-parser.service";
import {UiService} from "../../../../services/ui/ui.service";
import {TemplateSchemaService} from "../../services/template-schema.service";
import {InputType} from "../../models/input-type";
import {FileNode} from "../../models/file-node";


@Component({
  selector: 'cedar-metadata-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [TemplateParserService]

})

export class FormComponent implements OnChanges {

  @Input() id: string;
  @Input() viewOnly: boolean;
  @Output() changed = new EventEmitter<any>();

  form: FormGroup;
  dataSource: MatTreeNestedDataSource<FileNode>;
  treeControl: NestedTreeControl<FileNode>;
  database: TemplateParserService;
  route: ActivatedRoute;
  response: any = {payload: null, jsonLD: null, rdf: null, formValid: false};
  pageEvent: PageEvent;
  templateId;
  copy: string = "Copy";
  remove: string = "Remove";
  

  darkMode: boolean;
  private _darkModeSub: Subscription;

  private _subscription: Subscription;

  constructor(private ui: UiService, database: TemplateParserService, route: ActivatedRoute) {
    this.database = database;
    this.dataSource = new MatTreeNestedDataSource();
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.route = route;

  }

  changeLog: string[] = [];

  onPageChange(event) {
    this.pageEvent = event;
    const page = this.pageEvent.pageIndex;
    this.response.jsonLD = this.database.initialize(this.form, this.templateId, page, this.database.model);
    this.pageEvent.length = TemplateSchemaService.getPageCount(this.database.template);
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  onFormChanges() {
    this.response.payload = this.form.value;
    this.response.jsonLD = this.database.model;
    this.response.formValid = this.form.valid;
    let that = this;
    jsonld.toRDF(this.response.jsonLD, {format: 'application/nquads'}, function (err, nquads) {
      that.response.rdf = err ? err : nquads;
      that.changed.emit(that.response);
    });
  }

  onQuestionChanges(event) {
    switch (event.type) {
      case InputType.textfield:
        TemplateSchemaService.setTextValue(event.model, event.key, event.index, event.location, event.value);
        break;
      case InputType.list:
        TemplateSchemaService.setListValue(event.model, event.key, event.index, event.location, event.value);
        break;
      case InputType.date:
        const date = new Date(event.value);
        const isoDate = date.toISOString().substring(0, 10);
        TemplateSchemaService.setDateValue(event.model, event.key, event.index, event.location, isoDate);
        break;
      case InputType.radio:
        TemplateSchemaService.setRadioValue(event.model, event.key, event.index, event.location, event.value);
        break;
      case InputType.checkbox:
        TemplateSchemaService.setCheckValue(event.model, event.key, event.index, event.location, event.value);
        break;
      case InputType.attributeValue:
        TemplateSchemaService.setAttributeValue(event.model, event.key, event.model[event.key][event.index], event.lLocation, event.value);
        break;
    }
    this.onFormChanges();
  }

  // keep up-to-date on changes in the form
  onChanges(): void {
    if (this.form) {
      this._subscription = this.form.valueChanges.subscribe(val => {
        this.onFormChanges();
      });
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
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
    this.pageEvent = {"previousPageIndex": 0, "pageIndex": 0, "pageSize": 1, "length": 0};
    this.templateId = templateId;
    this.form = new FormGroup({});
    this.database.initialize(this.form, templateId);
    // this.pageEvent.length =  TemplateSchemaService.getPageCount(this.database.template);
    // this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    // this.dataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => {


      if (data && data.length > 0) {
        this.dataSource = new MatTreeNestedDataSource();
        this.dataSource.data = data;
        this.pageEvent.length = TemplateSchemaService.getPageCount(this.database.template);
        this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);

      }

    });
    this.onChanges();
    this.onFormChanges();
  }

  getTitle() {
    return this.database.getTitle();
  }

  isDisabled() {
    return this.viewOnly;
  }

  ngAfterViewInit() {
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

