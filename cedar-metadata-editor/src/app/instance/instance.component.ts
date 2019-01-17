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

export class ValueArray {
  min: number;
  max: number;
  values: any[];
}

export class FileNode {
  filename: string;
  helptext: string;
  required: boolean;
  hint: string;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
  pattern: string;
  type: string;
  subtype:string;
  name: string;
  options: any;
  value: ValueArray;
  formGroup: FormGroup;
  elementGroup: FormGroup;
  children: FileNode[];

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
    "name": {
      '@type': 'textfield',
      '@name': 'Name',
      key: 'name',
      subtype:'text',
      value:{
        min:1,
        max:2,
        values:['one','two'],
      },
      helptext: "Name of project",
      hint: "Enter the name of your project",
      required: false
    },
    "URL": {
      '@type': 'textfield',
      '@name': 'URL',
      key: 'url',
      subtype:'url',
      value:{
        min:1,
        max:1,
        values:['',''],
      },
      helptext: "URL of project",
      hint: "Enter the URL of your project",
      required: true
    },
    "description": {
      '@type': 'paragraph',
      '@name': 'Description',
      key: 'description',
      value:{
        min:1,
        max:2,
        values:['',''],
      },
      helptext: "Description of project",
      hint: "Enter the description of your project",
      required: true
    },
    "pies": {
      '@type': 'dropdown',
      '@name': 'Pies',
      key: 'pies',
      value:{
        min:1,
        max:2,
        values:['Rhubarb','Black Bottom'],
      },
      helptext: "pie filling",
      required: false,
      options: [
        {key: 'Rhubarb', value: 'Rhubarb'},
        {key: 'Cherry', value: 'Cherry'},
        {key: 'Key Lime', value: 'Key Lime'},
        {key: 'Black Bottom', value: 'Black Bottom'}
      ],
    },
    "runs": {
      '@type': 'textfield',
      '@name': 'Run count',
      subtype:'number',
      key: 'runs',
      value:{
        min:1,
        max:2,
        values:['',''],
      },
      helptext: "The number of experimental runs from 4 to 10",
      required: true,
      hint: "e.g. 5",
      min: 4,
      max: 10
    },
    "date": {
      '@type': 'date',
      '@name': 'Date',
      key: 'date',
      subtype:'date',
      value:{
        min:1,
        max:2,
        values:['5/22/87','8/17/85'],
      },
      helptext: "start date",
      required: false,
      hint: "Enter the start date of the project"
    },
    "goal": {
      '@type': 'checkbox',
      '@name': 'Goal',
      key: 'goal',
      subtype:'checkbox',
      value:{
        min:1,
        max:2,
        values:[[true,false,true,false],[false,false,true,true]],
      },
      required: false,
      options: [
        {key: 'initial', label: 'initial'},
        {key: 'in process', label: 'in process'},
        {key: 'in committee', label: 'in committee'},
        {key: 'complete', label: 'complete'}
      ],
    },
    "status": {
      '@type': 'radio',
      '@name': 'Status',
      subtype:'radio',
      key: 'status',
      value:{
        min:1,
        max:2,
        values:['begin','finish'],
      },
      required: false,
      helptext: "status of project",
      hint: "begin",
      options: [
        {key: 'begin', label: 'begin', value: 'begin'},
        {key: 'start', label: 'start', value: 'start'},
        {key: 'middle', label: 'middle', value: 'middle'},
        {key: 'finish', label: 'finish', value: 'finish'}
      ],
    },
    "organism": {
      '@type': 'textfield',
      '@name': 'Organism',
      subtype:'text',
      key: 'organism',
      value:{
        min:1,
        max:1,
        values:[''],
      },
      required: false,
      helptext: "The organism on which your experiment acted",
      hint: "e.g. human"
    },
    "contact": {
      '@type': "element", '@name': 'Contact',
      'firstname': {
        '@type': "textfield",
        '@name': 'First name',
        subtype:'text',
        key: 'first name',
        value:{
          min:1,
          max:1,
          values:[''],
        },
        required: false,
        helptext: "The first name of your contact"
      },
      'lasttname': {
        '@type': "textfield",
        '@name': 'Last name',
        subtype:'text',
        key: 'last name',
        value:{
          min:1,
          max:1,
          values:[''],
        },
        required: false,
        helptext: "The last name of your contact"
      },
      "email": {
        '@type': "textfield",
        '@name': 'Email',
        subtype:'email',
        key: 'email',
        value:{
          min:1,
          max:2,
          values:['',''],
        },
        helptext: "Email of contact",
        hint: "Enter the email address for your contact",
        required: true
      },
      'phone': {
        '@type': "textfield",
        '@name': 'Phone',
        subtype:'tel',
        key: 'phone',
        value:{
          min:1,
          max:1,
          values:[''],
        },
        hint: "e.g. 555-555-1212",
        required: false,
        helptext: "The phone number of your contact"
      },
      "context": {
        '@type': "textfield",
        '@name': 'Context',
        subtype:'text',
        key: 'context',
        value:{
          min:1,
          max:1,
          values:[''],
        },
        required: false,
        helptext: "The context of your project",
        hint: "e.g. NCI"
      },
      "classification": {
        '@type': "textfield",
        '@name': 'Classification',
        subtype:'text',
        key: 'classification',
        value:{
          min:1,
          max:1,
          values:[''],
        },
        required: false,
        helptext: "The classification of your project",
        hint: "e.g. Cancer"
      },
      "address": {
        '@type': "element",
        '@name': 'Address',
        'phone': {
          '@type': "textfield",
          '@name': 'Phone',
          subtype:'tel',
          key: 'phone',
          value:{
            min:1,
            max:1,
            values:[''],
          },
          hint: "e.g. 555-555-1212",
          required: false,
          helptext: "The phone number of your contact"
        },
        "context": {
          '@type': "textfield",
          '@name': 'Context',
          subtype:'text',
          key: 'context',
          value:{
            min:1,
            max:1,
            values:[''],
          },
          required: false,
          helptext: "The context of your project",
          hint: "e.g. NCI"
        },
      }
    }
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
          node.helptext = value['helptext'];
          node.required = value['required'];
          node.hint = value['hint'];
          node.min = value['min'];
          node.max = value['max'];
          node.subtype = value['subtype'];


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
  payload: any;

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


  onSubmit(value: any, source: string) {
    console.log('onSubmit', source, value, this.form);
    this.payload = this.form.value;
  }


}
