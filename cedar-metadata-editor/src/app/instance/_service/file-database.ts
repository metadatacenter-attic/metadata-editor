/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

import {FileNode} from "../_models/file-node";
import {PageNode} from "../_models/page-node";

const TREE_DATA = JSON.stringify({
    "Project": {
      '@type': 'element',
      '@name': 'Project',
      "name": {
        '@type': 'textfield',
        '@name': 'Name',
        key: 'name',
        subtype: 'text',
        value: {
          min: 1,
          max: 2,
          values: ['one', 'two'],
        },
        helptext: "Name of project",
        hint: "Enter the name of your project",
        required: false
      },
      "URL": {
        '@type': 'textfield',
        '@name': 'URL',
        key: 'url',
        subtype: 'url',
        value: {
          min: 1,
          max: 1,
          values: ['', ''],
        },
        helptext: "URL of project",
        hint: "Enter the URL of your project",
        required: true
      },
      "pies": {
        '@type': 'dropdown',
        '@name': 'Pies',
        key: 'pies',
        value: {
          min: 1,
          max: 2,
          values: ['Rhubarb', 'Black Bottom'],
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
    },
    "Subjects": {
      '@type': 'element',
      '@name': 'Subjects',
      "date": {
        '@type': 'date',
        '@name': 'Date',
        key: 'date',
        subtype: 'date',
        value: {
          min: 1,
          max: 2,
          values: ['5/22/87', '8/17/85'],
        },
        helptext: "start date",
        required: false,
        hint: "Enter the start date of the project"
      },
      "status": {
        '@type': 'radio',
        '@name': 'Status',
        subtype: 'radio',
        key: 'status',
        value: {
          min: 1,
          max: 2,
          values: [0, 3],
        },
        required: false,
        helptext: "status of project",
        hint: "begin",
        options: [
          {label: 'begin', value: 0},
          {label: 'start', value: 1},
          {label: 'middle', value: 2},
          {label: 'finish', value: 3}
        ],
      },
      "organism": {
        '@type': 'textfield',
        '@name': 'Organism',
        subtype: 'text',
        key: 'organism',
        value: {
          min: 1,
          max: 1,
          values: [''],
        },
        required: false,
        helptext: "The organism on which your experiment acted",
        hint: "e.g. human"
      }
    },
    "Experiments": {
      '@type': 'element',
      '@name': 'Experiments',
      "description": {
        '@type': 'paragraph',
        '@name': 'Description',
        key: 'description',
        value: {
          min: 1,
          max: 2,
          values: ['', ''],
        },
        helptext: "Description of project",
        hint: "Enter the description of your project",
        required: true
      },
      "runs": {
        '@type': 'textfield',
        '@name': 'Run count',
        subtype: 'number',
        key: 'runs',
        value: {
          min: 1,
          max: 2,
          values: ['', ''],
        },
        helptext: "The number of experimental runs from 4 to 10",
        required: true,
        hint: "e.g. 5",
        min: 4,
        max: 10
      },
      "contact": {
        '@type': "element", '@name': 'Contact',
        'firstname': {
          '@type': "textfield",
          '@name': 'First name',
          subtype: 'text',
          key: 'first name',
          value: {
            min: 1,
            max: 1,
            values: [''],
          },
          required: false,
          helptext: "The first name of your contact"
        },
        'lasttname': {
          '@type': "textfield",
          '@name': 'Last name',
          subtype: 'text',
          key: 'last name',
          value: {
            min: 1,
            max: 1,
            values: [''],
          },
          required: false,
          helptext: "The last name of your contact"
        },
        "email": {
          '@type': "textfield",
          '@name': 'Email',
          subtype: 'email',
          key: 'email',
          value: {
            min: 1,
            max: 2,
            values: ['', ''],
          },
          helptext: "Email of contact",
          hint: "Enter the email address for your contact",
          required: true
        },
        'phone': {
          '@type': "textfield",
          '@name': 'Phone',
          subtype: 'tel',
          key: 'phone',
          value: {
            min: 1,
            max: 1,
            values: [''],
          },
          hint: "e.g. 555-555-1212",
          required: false,
          helptext: "The phone number of your contact"
        },
        "context": {
          '@type': "textfield",
          '@name': 'Context',
          subtype: 'text',
          key: 'context',
          value: {
            min: 1,
            max: 1,
            values: [''],
          },
          required: false,
          helptext: "The context of your project",
          hint: "e.g. NCI"
        },
        "classification": {
          '@type': "textfield",
          '@name': 'Classification',
          subtype: 'text',
          key: 'classification',
          value: {
            min: 1,
            max: 1,
            values: [''],
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
            subtype: 'tel',
            key: 'phone',
            value: {
              min: 1,
              max: 1,
              values: [''],
            },
            hint: "e.g. 555-555-1212",
            required: false,
            helptext: "The phone number of your contact"
          },
          "context": {
            '@type': "textfield",
            '@name': 'Context',
            subtype: 'text',
            key: 'context',
            value: {
              min: 1,
              max: 1,
              values: [''],
            },
            required: false,
            helptext: "The context of your project",
            hint: "e.g. NCI"
          },
        }
      },
      "goal": {
        '@type': 'checkbox',
        '@name': 'Goal',
        key: 'goal',
        subtype: 'checkbox',
        value: {
          min: 1,
          max: 2,
          values: [[true, false, true, false], [false, false, true, true]],
        },
        required: false,
        options: [
          {key: 'initial', label: 'initial'},
          {key: 'in process', label: 'in process'},
          {key: 'in committee', label: 'in committee'},
          {key: 'complete', label: 'complete'}
        ],
      }
    }
  }
);


@Injectable()
export class FileDatabase {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);


  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize(new FormGroup({}));
  }

  initialize(formGroup: FormGroup) {
    // Parse the string to json object.
    //
    const dataObject = JSON.parse(TREE_DATA);


    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.


    const data = this.buildFileTree(dataObject, 0, formGroup, null);
    this.dataChange.next(data);


  }


  buildFileTree(obj: { [key: string]: any }, level: number, formGroup: FormGroup, parent:FileNode): FileNode[] {
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
          node.parent = parent;


          if (value['@type'] == 'element' || value['@type'] == 'template') {
            node.elementGroup = new FormGroup({});
            node.children = this.buildFileTree(value, level + 1, node.elementGroup, node);
          } else {
            node.type = value['@type'];
          }
        }
      }

      return (key.charAt(0) == '@') ? accumulator : accumulator.concat(node)

    }, []);
  }
}
