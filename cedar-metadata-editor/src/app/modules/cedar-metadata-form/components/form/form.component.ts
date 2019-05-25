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
import {TemplateService} from "../../services/template.service";
import {TreeNode} from "../../models/tree-node.model";
import {InputTypeService} from "../../services/input-type.service";
import {InstanceService} from "../../services/instance.service";


@Component({
  selector: 'cedar-metadata-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [TemplateParserService]

})

export class FormComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() instance: any;
  @Input() template: any;
  @Input() disabled: boolean;
  @Input() autocompleteResults: any;
  @Output() changed = new EventEmitter<any>();
  @Output() autocomplete = new EventEmitter<any>();


  title: string;
  description: string;
  dataSource: MatTreeNestedDataSource<TreeNode>;
  treeControl: NestedTreeControl<TreeNode>;
  database: TemplateParserService;
  route: ActivatedRoute;
  response: any = {payload: null, jsonLD: null, rdf: null, formValid: false};
  pageEvent: PageEvent;
  copy: string = "Copy";
  remove: string = "Remove";
  private formChanges: Subscription;

  constructor(private ui: UiService, database: TemplateParserService, route: ActivatedRoute) {
    this.pageEvent = {"previousPageIndex": 0, "pageIndex": 0, "pageSize": 1, "length": 0};
    this.database = database;
    this.dataSource = new MatTreeNestedDataSource();
    this.treeControl = new NestedTreeControl<TreeNode>(this._getChildren);
    this.route = route;
  }

  changeLog: string[] = [];


  onPageChange(event) {
    this.pageEvent = event;
    this.initialize();
  }

  onAutocomplete(event) {
    this.autocomplete.emit(event);
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
    if (changes['autocompleteResults']) {
      this.autocompleteResults = changes['autocompleteResults']['currentValue'];
    } else {


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
  }

  private hasNestedChild = (_: number, nodeData: TreeNode) => !nodeData.type;

  private _getChildren = (node: TreeNode) => node.children;

  initialize() {

    if (this.instance && this.template) {
      this.pageEvent.length = TemplateService.getPageCount(this.template);

      //this.form = new FormGroup({});
      this.title = InstanceService.getTitle(this.instance) || TemplateService.getTitle(this.template);
      this.description = InstanceService.getDescription(this.instance) || TemplateService.getDescription(this.template);
      this.database.initialize(this.form, this.instance, this.template, this.pageEvent.pageIndex);


      this.database.dataChange.subscribe(data => {
        if (data && data.length > 0) {
          this.dataSource = new MatTreeNestedDataSource();
          this.dataSource.data = data;
          this.treeControl = new NestedTreeControl<TreeNode>(this._getChildren);
        }
      });
      this.onChanges();
    }
  }

  getPageCount(nodes: TreeNode[]) {
    let count = 0;
    nodes.forEach(function (node) {
      if (InputTypeService.isPageBreak(node.subtype)) {
        count++;
      }
    });
    return count + 1;
  }

  isDisabled() {
    return this.disabled;
  }

  ngAfterViewInit() {
  }

  // add new element to form
  copyItem(node: TreeNode) {
    console.log('copyItem', Array.isArray(node.model[node.key]))

    const clonedModel = cloneDeep(node.model[node.key][node.itemCount]);
    node.model[node.key].splice(node.itemCount + 1, 0, clonedModel);

    let clonedNode = cloneDeep(node);
    clonedNode.model = node.model;
    clonedNode.itemCount++;
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index + 1, 0, clonedNode);

    // adjust remaining siblings itemCounts
    for (let i = index + 2; i < siblings.length; i++) {
      if (siblings[i].key == node.key) {
        siblings[i].itemCount++;
      }
    }
    this.updateModel(clonedNode, node.model);
    const parentGroup = node.parentGroup || this.form;
    parentGroup.addControl((clonedNode.key + clonedNode.itemCount), clonedNode.formGroup);
    this.database.dataChange.next(this.database.data);
  }

  // delete last element in node array
  removeItem(node: TreeNode) {
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index, 1);

    // adjust remaining siblings itemCounts
    for (let i = index; i < siblings.length; i++) {
      if (siblings[i].key == node.key) {
        siblings[i].itemCount--;
      }
    }

    const parent = node.parentGroup || this.form;
    parent.removeControl((node.key + node.itemCount));
    this.database.dataChange.next(this.database.data);
  }


  // reset the model down the tree at itemCount
  updateModel(node: TreeNode, model) {

    node.model = model;

    if (node.children) {

      let that = this;
      let key = node.key;
      let itemCount = node.itemCount;

      if (Array.isArray(model[key])) {
        node.children.forEach(function (child) {
          that.updateModel(child, model[key][itemCount]);
        });
      } else {
        node.children.forEach(function (child) {
          that.updateModel(child, model[key]);
        });
      }
      
    }
  }


}

