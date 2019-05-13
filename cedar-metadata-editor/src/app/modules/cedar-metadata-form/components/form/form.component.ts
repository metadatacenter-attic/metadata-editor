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
import {MetadataModel, MetadataSnip} from "../../models/metadata-model";
import {TemplateSchema} from "../../models/template-schema";
import {InputTypeService} from "../../services/input-type.service";


@Component({
  selector: 'cedar-metadata-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [TemplateParserService]

})

export class FormComponent implements OnChanges {

  //@Input() id: string;
  @Input() instance: any;
  @Input() template: any;
  @Input() controlledTermsCallback: any;
  @Input() viewOnly: boolean;
  @Input() classLoader: any;
  @Output() changed = new EventEmitter<any>();

  form: FormGroup;
  title:string;
  dataSource: MatTreeNestedDataSource<FileNode>;
  treeControl: NestedTreeControl<FileNode>;
  database: TemplateParserService;
  route: ActivatedRoute;
  response: any = {payload: null, jsonLD: null, rdf: null, formValid: false};
  pageEvent: PageEvent;
  copy: string = "Copy";
  remove: string = "Remove";

  darkMode: boolean;
  private _darkModeSub: Subscription;
  private formChanges: Subscription;

  constructor(private ui: UiService, database: TemplateParserService, route: ActivatedRoute) {
    this.pageEvent = {"previousPageIndex": 0, "pageIndex": 0, "pageSize": 1, "length": 0};
    this.database = database;
    this.dataSource = new MatTreeNestedDataSource();
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.route = route;
    this.title = 'loading'
  }

  changeLog: string[] = [];

  onPageChange(event) {
    console.log('onPageChange',event)
    this.pageEvent = event;
    this.initialize() ;
    // if (this.instance && this.template) {
    //   this.pageEvent = event;
    //   this.response.jsonLD = this.database.initialize(this.form, this.database.instanceModel, this.database.template, this.pageEvent.pageIndex);
    //   this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    //   this.dataSource = new MatTreeNestedDataSource();
    //   this.database.dataChange.subscribe(data => {
    //     this.dataSource.data = data;
    //   });
    // }
  }

  // keep up-to-date on changes in the form
  onChanges(): void {
    if (this.form) {
      this.formChanges = this.form.valueChanges.subscribe(val => {
        setTimeout(() => {
          this.response.payload = val;
          this.response.jsonLD = this.database.instanceModel;
          this.response.formValid = this.form.valid;
          let that = this;
          jsonld.toRDF(this.response.jsonLD, {format: 'application/nquads'}, function (err, nquads) {
            that.response.rdf = err ? err : nquads;
            that.changed.emit(that.response);
          });
        }, 0);
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
    this.initialize();
  }

  private hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;

  initialize() {
    if (this.instance && this.template) {
      this.pageEvent.length = TemplateSchemaService.getPageCount(this.template);

      this.form = new FormGroup({});
      this.database.initialize(this.form, this.instance, this.template,this.pageEvent.pageIndex);
      this.title = this.database.getTitle();
      this.database.dataChange.subscribe(data => {
        if (data && data.length > 0) {
          this.dataSource = new MatTreeNestedDataSource();
          this.dataSource.data = data;
          console.log('page length',this.pageEvent);
          this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
        }
      });
      this.onChanges();
    }
  }

  getPageCount(nodes: FileNode[]) {
    let count = 0;
    nodes.forEach(function (node) {
      console.log(node.type,node.subtype);
      if (InputTypeService.isPageBreak(node.subtype)) {
        count++;
      }
    });
    return count + 1;
  }

  isDisabled() {
    return this.viewOnly;
  }

  ngAfterViewInit() {
  }

  // add new element to form
  copyItem(node: FileNode) {
    const itemModel = cloneDeep(node.model[node.key][node.itemCount]);
    node.model[node.key].splice(node.itemCount + 1, 0, itemModel);

    let clonedNode = cloneDeep(node);
    clonedNode.model = node.model;
    clonedNode.itemCount++;
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index + 1, 0, clonedNode);

    // adjust remaining siblings itemCounts
    for (let i=index+2;i<siblings.length;i++) {
      if (siblings[i].key == node.key) {
        siblings[i].itemCount++;
      }
    }
    this.updateModel(clonedNode, node.model);

    const parent = node.parentGroup || this.form;
    parent.addControl((clonedNode.key + clonedNode.itemCount), clonedNode.formGroup);

    this.database.dataChange.next(this.database.data);
  }

  // delete last element in node array
  removeItem(node: FileNode) {
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index, 1);

    // adjust remaining siblings itemCounts
    for (let i=index;i<siblings.length;i++) {
      if (siblings[i].key == node.key) {
        siblings[i].itemCount--;
      }
    }

    const parent = node.parentGroup || this.form;
    parent.removeControl((node.key + node.itemCount));
    this.database.dataChange.next(this.database.data);
    //this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }


  // reset the model down the tree at itemCount
  updateModel(node: FileNode, model) {
    node.model = model;

    //console.log('updateModel',node.key, model);
    if (node.children ) {

      let that = this;
      let key = node.key;
      let itemCount = node.itemCount;

      node.children.forEach(function (child){
        console.log('updateModel child', child.key,  model );
        that.updateModel(child, model[key][itemCount]);
      });
    } else {
      console.log('updateModel field',node.key,  model);
      node.model = model;
    }
  }



}

