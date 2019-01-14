import {Component, Injectable, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormArray, FormGroup, FormControl} from '@angular/forms';
import {MatTreeNestedDataSource} from '@angular/material/tree';
// import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import {NestedTreeControl} from '@angular/cdk/tree';
// import {FlatTreeControl} from '@angular/cdk/tree';

import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';


import {UiService} from "../services/ui/ui.service";
import {QuestionService} from "./form/service/question.service";
import {QuestionBase} from "./form/question/_models/question-base";
import {ElementQuestion} from "./form/question/_models/question-element";
import {TextboxQuestion} from "./form/question/_models/question-textbox";
import {StaticQuestion} from "./form/question/_models/question-static";
import {DropdownQuestion} from "./form/question/_models/question-dropdown";

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */


export class FileNode {
  filename: string;
  type: string;
  children: FileNode[];
  value: string;
  name: string;
  options:any;
  formGroup: FormGroup;
  elementGroup: FormGroup;
}

/** Flat node with expandable and level information */
// export class FileNestedNode {
//   constructor(
//     public expandable: boolean, public filename: string, public level: number, public type: any, public question:QuestionBase<string>) {}
// }

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */

const TREE_DATA = JSON.stringify({

  "project": {
    '@type': 'element', '@name': 'Project',
    "namex": {'@type': 'textfield', '@name': 'namex', key: 'namex', value: 'first last'},
    "pies": {'@type': 'dropdown', '@name': 'pies', key: 'pies', value: 'Rhubarb', options: [
        {key: 'Rhubarb',  value: 'Rhubarb'},
        {key: 'Cherry',  value: 'Cherry'},
        {key: 'Key Lime',   value: 'Key Lime'},
        {key: 'Black Bottom', value: 'Black Bottom'}
      ],},
    "date": {'@type': 'textfield', '@name': 'date', key: 'date', value: 'date'},
    "organism": {'@type': 'textfield', '@name': 'organism', key: 'organism', value: 'my PI'},
    "context": {'@type': "textfield", '@name': 'context', key: 'context', value: 'context'},
    "classification": {'@type': "textfield", '@name': 'classification', key: 'classification', value: 'classification'},

    "contact": {
      '@type': "element", '@name': 'Contact',
      'firstname': {'@type': "textfield", '@name': 'first name', key: 'first name', value: 'Nancy'},
      'lasttname': {'@type': "textfield", '@name': 'last name', key: 'last name', value: 'Pelosi'},
      'phone': {'@type': "textfield", '@name': 'phone', key: 'phone', value: '555-555-1212'},
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
  formGroup: FormGroup;

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize(new FormGroup({}));
  }

  initialize(formGroup: FormGroup) {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.

    const data = this.buildFileTree(dataObject, 0, formGroup);

    // Notify the change.
    this.dataChange.next(data);
  }


  buildFileTree(obj: { [key: string]: any }, level: number, formGroup: FormGroup): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {

      const value = obj[key];
      const node = new FileNode();

      if (value != null) {
        if (typeof value === 'object') {
          node.filename = key;
          node.name = value['@name'];
          node.value = value['value'];
          node.options = value['options'];
          node.formGroup = formGroup;

          if (value['@type'] == 'element' || value['@type'] == 'template') {
            node.elementGroup = new FormGroup({});
            node.children = this.buildFileTree(value, level + 1, node.elementGroup);
          } else {
            node.type = value['@type'];
          }
        }
      }

      return (key.charAt(0) == '@') ? accumulator : accumulator.concat(node)

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
  treeControl: NestedTreeControl<FileNode>;
  dataSource: MatTreeNestedDataSource<FileNode>;
  database: FileDatabase;

  formId: string;
  projectFormName: string;
  form: FormGroup;
  payload:any;

  private _subscription: Subscription;
  formInvalid: boolean = false;

  title: string;
  questions: [QuestionBase<any>];


  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService, qs: QuestionService, database: FileDatabase) {

    this.projectFormName = 'projectFormName';
    this.questions = qs.getQuestions('projectForm');
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
      console.log('onChanges')
      this.payload = val;
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




  onSubmit(value:any, source:string) {
    console.log('onSubmit', source, value);
    this.payload = this.form.value;
  }


}
