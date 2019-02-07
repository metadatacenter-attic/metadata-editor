import {Component, Injectable, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormArray, FormGroup, FormControl, AbstractControl} from '@angular/forms';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {ActivatedRoute} from '@angular/router';


import {UiService} from '../services/ui/ui.service';
import {QuestionBase} from './form/question/_models/question-base';
import {FileNode} from './_models/file-node';
import {FileDatabase} from './_service/file-database';
import {TemplateSchemaService} from './_service/template-schema.service';
import {TemplateService} from './_service/template.service';
import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: [FileDatabase, TemplateService, TemplateSchemaService]
})

export class InstanceComponent implements OnInit {
  treeControl: NestedTreeControl<FileNode>;
  dataSource: MatTreeNestedDataSource<FileNode>;
  database: TemplateService;
  form: FormGroup;

  payload: any;
  jsonld: any;
  rdf: any;

  id:number;

  formTitle: string;
  formDescription: string;
  formIdentifier: string;

  formInvalid:boolean = false;

  private _subscription: Subscription;

  title: string = 'Cedar Metadata Editor';
  questions: [QuestionBase<any>];

  darkMode: boolean;
  private _darkModeSub: Subscription;

  route: ActivatedRoute;
  private _routeSubscribe: Subscription;

  constructor(private ui: UiService, ts: TemplateService, route: ActivatedRoute) {
    this.database = ts;
    this.route = route;
  }

  initialize(templateId:string) {

    let getChildren = (node: FileNode) => node.children;

    this.form = new FormGroup({});
    this.database.initialize(this.form, templateId);
    this.treeControl = new NestedTreeControl<FileNode>(getChildren);
    this.dataSource = new MatTreeNestedDataSource();
    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    setTimeout(() => {
      this.payload = this.form.value;
      this.formInvalid = !this.form.valid
    }, 0);


  }

  ngAfterViewInit() {
    this.onChanges();
    setTimeout(() => {
      //this.formInvalid = !this.form.valid;
    }, 0);
  }

  ngOnInit() {
    this.route.params.subscribe((val) => {
      this.initialize(val.templateId);
    });

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

  onChanges(): void {
    if (this.form) {
      this._subscription = this.form.valueChanges.subscribe(val => {
        this.payload = val;
        setTimeout(() => {
          this.formInvalid = !this.form.valid;
        }, 0);
      });
    }
  }

  cloneAbstractControl(control: AbstractControl) {
    let newControl: AbstractControl;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });

      newControl = formGroup;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)))

      newControl = formArray;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator);
    } else {
      throw 'Error: unexpected control value';
    }

    if (control.disabled) {
      newControl.disable({emitEvent: false});
    }

    return newControl;
  }

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

  addNewItem(node: FileNode) {

    const clonedObject: FileNode = cloneDeep(node);
    clonedObject.itemCount++;
    clonedObject.key += clonedObject.itemCount;
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index + 1, 0, clonedObject);


    clonedObject.parentGroup = node.parentGroup;
    node.parentGroup.addControl(clonedObject.key, clonedObject.formGroup);
    //this.walkTree(clonedObject, clonedObject.formGroup, clonedObject.parent);
    this.database.dataChange.next(this.database.data);
    this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});

    // clonedObject.formGroup.valueChanges.subscribe(val => {
    //   console.log('clonedObject valueChanges', val);
    // });

  }

  deleteLastItem(node: FileNode) {
    console.log('deleteLastItem', node);
    const siblings = node.parent ? node.parent.children : this.database.data;
    const index = siblings.indexOf(node);
    siblings.splice(index, 1);
    this.database.dataChange.next(this.database.data);
    node.parentGroup.removeControl(node.key);
    this.form.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  // transformer = (node: FileNode, level: number) => {
  //   return new FileNestedNode(!!node.children, node.filename, level, node.type, node.question);
  // }

  // private _getLevel = (node: FileNestedNode) => node.level;

  // private _isExpandable = (node: FileNestedNode) => node.expandable;


  // hasChild = (_: number, _nodeData: FileNestedNode) => _nodeData.expandable;

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;


  onSubmit(value: any,) {
    this.payload = this.form.value;
  }


}
