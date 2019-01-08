import {Component, Injectable, OnInit} from '@angular/core';
import { Subscription } from 'rxjs'
import { FormGroup }  from '@angular/forms';
// import {MatTreeNestedDataSource} from '@angular/material/tree';

// import {NestedTreeControl} from '@angular/cdk/tree';

import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';


import { UiService } from "../services/ui/ui.service";
import { QuestionService } from "./form/service/question.service";
import { QuestionBase } from "./form/question/_models/question-base";
import {ElementQuestion} from "./form/question/_models/question-element";
import {TextboxQuestion} from "./form/question/_models/question-textbox";
import {StaticQuestion} from "./form/question/_models/question-static";
import {DropdownQuestion} from "./form/question/_models/question-dropdown";

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */


export class FileNode  {

  filename: string;
  type: string;
  children: FileNode[];
  question:QuestionBase<string>;

}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public expandable: boolean, public filename: string, public level: number, public type: any, public question:QuestionBase<string>) {}
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */

const TREE_DATA = JSON.stringify({
  "project": {
    '@type':'template','@name': 'Project',
    "namex": {'@type':'textfield', '@name':'namex', key: 'namex',  value: 'first last'},
    "pies": {'@type':'textfield', '@name':'pies',  key: 'pies',  value: 'pies'},
    "date": {'@type':'textfield', '@name': 'date', key: 'date',  value: 'date'},
    "organism": {'@type':'textfield', '@name': 'organism',   key: 'organism',  value: 'my PI'},
    "context": {'@type':"textfield",  '@name': 'context',  key: 'context', value: 'context'},
    "classification": {'@type':"textfield", '@name': 'classification',  key: 'classification', value: 'classification'},

    "contact": {
      '@type':"element", '@name': 'Contact',
      "firstname": {'@type':"textfield", '@name': 'first name', key: 'first name',  value: 'Nancy'},
      "lasttname": {'@type':"textfield", '@name': 'last name', key: 'last name',  value: 'Pelosi'},
      "phone": {'@type':"textfield", '@name': 'phone', key: 'phone',  value: '555-555-1212'},
    },


  }
});



/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {

      const value = obj[key];
      const filename = key;
      const node = new FileNode();
      node.filename = key;
      node.type = value['@type'];


      if (key != '@type'  &&  value && value['@type'] ) {
        console.log('key, value',key, obj[key])

        if (value['@type'] == 'element' || value['@type'] == 'template') {
          node.question = new ElementQuestion({
            name:value['@name'],
            type:value['@type'],
            key: value['key'],
            value: value['value'],

          });
          node.type = value['@type'];
          node.children = this.buildFileTree(value, level + 1);
        } else {

          node.question = new TextboxQuestion({
            name:value['@name'],
            type:value['@type'],
            key: value['key'],
            value: value['value'],

          });

        }
        accumulator = accumulator.concat(node)
      }

      console.log('accumulator',accumulator);
      return accumulator;
    }, []);
  }
}


@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.less'],
  providers: [QuestionService, FileDatabase]
})

export class InstanceComponent implements OnInit {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  formId:string;
  form:FormGroup;

  title:string;
  questions: [QuestionBase<any>];
  payload:string;

  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService, qs:QuestionService, database: FileDatabase) {

    this.questions = qs.getQuestions('projectForm');
    this.payload = '';
    let group = {};
    this.form = new FormGroup(group);


    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => this.dataSource.data = data);
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(!!node.children, node.filename, level, node.type, node.question);
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;


  ngOnInit() {
    this.title = 'Cedar Metadata Editor';
    this.formId = 'projectForm';


    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
    this.darkMode = value;
  })}



}
