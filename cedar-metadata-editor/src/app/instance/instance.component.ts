import {Component, Injectable, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormArray, FormGroup, FormControl} from '@angular/forms';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';

import {UiService} from "../services/ui/ui.service";
import {QuestionBase} from "./form/question/_models/question-base";
import {ValueArray} from "./_models/value-array";
import {FileNode} from "./_models/file-node";
import {FileDatabase} from "./_service/file-database";




@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: [FileDatabase]
})

export class InstanceComponent implements OnInit {
  treeControl: NestedTreeControl<FileNode>;
  dataSource: MatTreeNestedDataSource<FileNode>;
  database: FileDatabase;

  formId: string;
  projectFormName: string;
  form: FormGroup;
  payload: any;

  private _subscription: Subscription;
  formInvalid: boolean = true;

  title: string;
  questions: [QuestionBase<any>];


  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService,  database: FileDatabase) {

    this.projectFormName = 'projectFormName';
    // this.payload = {};
    this.database = database;
    this.treeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.dataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    this.form = database.data[0].formGroup;
  }

  ngAfterViewInit() {
    //this.payload = this.form.value;
    this.onChanges();
    setTimeout(() => {
      this.formInvalid = !this.form.valid;
    }, 0);
  }

  ngOnInit() {
    this.title = 'Cedar Metadata Editor';
    this.formId = 'projectForm';

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    })
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.payload = val;
      setTimeout(() => {
        this.formInvalid = !this.form.valid;
      }, 0);
    });
  }

  // transformer = (node: FileNode, level: number) => {
  //   return new FileNestedNode(!!node.children, node.filename, level, node.type, node.question);
  // }

  //private _getLevel = (node: FileNestedNode) => node.level;

  //private _isExpandable = (node: FileNestedNode) => node.expandable;


  //hasChild = (_: number, _nodeData: FileNestedNode) => _nodeData.expandable;

  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;

  private _getChildren = (node: FileNode) => node.children;
  
  onSubmit(value: any, source: string) {
    this.payload = this.form.value;
  }


}
