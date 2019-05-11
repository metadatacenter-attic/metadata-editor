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
import {MetadataModel} from "../../models/metadata-model";
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

