/**
 * File database builds a tree structured Json object from string.
 * Each node in Json object represents an element or field. For a field, it has filename and type.
 * For an element, it has filename and children (a list of fields or elements).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {FileNode} from "../models/file-node";




const TREE_DATA = JSON.stringify({
  'Multiple0': {
    '@type': 'element',
    '@name': 'Multiple',
    '@minItems': 0,
    '@maxItems': 10,
    '@itemCount': 0,
    'name': {
      '@type': 'textfield',
      '@name': 'Name',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'name',
      subtype: 'text',
      value: {
        values: ['one', 'two'],
      },
      helpText: 'Name of project',
      hint: 'Enter the name of your project',
      required: false
    },
    'URL': {
      '@type': 'textfield',
      '@name': 'URL',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'url',
      subtype: 'url',
      value: {
        values: ['', ''],
      },
      helpText: 'URL of project',
      hint: 'Enter the URL of your project',
      required: true
    },
    'pies': {
      '@type': 'dropdown',
      '@name': 'Pies',
      key: 'pies',
      value: {
        min: 1,
        max: 2,
        values: ['Rhubarb', 'Black Bottom'],
      },
      helpText: 'pie filling',
      required: false,
      options: [
        {key: 'Rhubarb', value: 'Rhubarb'},
        {key: 'Cherry', value: 'Cherry'},
        {key: 'Key Lime', value: 'Key Lime'},
        {key: 'Black Bottom', value: 'Black Bottom'}
      ],
    },
  },
  'Multiple1': {
    '@type': 'element',
    '@name': 'Multiple',
    '@maxItems': 10,
    '@minItems': 0,
    '@itemCount': 1,
    'name': {
      '@type': 'textfield',
      '@name': 'Name',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'name',
      subtype: 'text',
      value: {
        values: ['one', 'two'],
      },
      helpText: 'Name of project',
      hint: 'Enter the name of your project',
      required: false
    },
    'URL': {
      '@type': 'textfield',
      '@name': 'URL',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'url',
      subtype: 'url',
      value: {
        min: 1,
        max: 1,
        values: ['', ''],
      },
      helpText: 'URL of project',
      hint: 'Enter the URL of your project',
      required: true
    },
    'pies': {
      '@type': 'dropdown',
      '@name': 'Pies',
      key: 'pies',
      value: {
        min: 1,
        max: 2,
        values: ['Rhubarb', 'Black Bottom'],
      },
      helpText: 'pie filling',
      required: false,
      options: [
        {key: 'Rhubarb', value: 'Rhubarb'},
        {key: 'Cherry', value: 'Cherry'},
        {key: 'Key Lime', value: 'Key Lime'},
        {key: 'Black Bottom', value: 'Black Bottom'}
      ],
    },
  },
  'Project': {
    '@type': 'element',
    '@name': 'Project',
    'name': {
      '@type': 'textfield',
      '@name': 'Name',
      key: 'name',
      subtype: 'text',
      value: {
        values: ['one'],
      },
      helpText: 'Name of project',
      hint: 'Enter the name of your project',
      required: false
    },
    'URL': {
      '@type': 'textfield',
      '@name': 'URL',
      key: 'url',
      subtype: 'url',
      value: {
        values: [''],
      },
      helpText: 'URL of project',
      hint: 'Enter the URL of your project',
      required: true
    },
    'pies': {
      '@type': 'dropdown',
      '@name': 'Pies',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'pies',
      value: {
        values: ['Rhubarb', 'Black Bottom'],
      },
      helpText: 'pie filling',
      required: false,
      options: [
        {key: 'Rhubarb', value: 'Rhubarb'},
        {key: 'Cherry', value: 'Cherry'},
        {key: 'Key Lime', value: 'Key Lime'},
        {key: 'Black Bottom', value: 'Black Bottom'}
      ],
    },
  },
  'Subjects': {
    '@type': 'element',
    '@name': 'Subjects',
    '@minItems': 0,
    '@maxItems': 2,
    '@itemCount': 0,
    'date': {
      '@type': 'date',
      '@name': 'Date',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'date',
      subtype: 'date',
      value: {
        values: ['5/22/87', '8/17/85'],
      },
      helpText: 'start date',
      required: false,
      hint: 'Enter the start date of the project'
    },
    'status': {
      '@type': 'radio',
      '@name': 'Status',
      '@minItems': 0,
      '@maxItems': 2,
      subtype: 'radio',
      key: 'status',
      value: {
        values: [0, 3],
      },
      required: false,
      helpText: 'status of project',
      hint: 'begin',
      options: [
        {label: 'begin', value: 0},
        {label: 'start', value: 1},
        {label: 'middle', value: 2},
        {label: 'finish', value: 3}
      ],
    },
    'organism': {
      '@type': 'textfield',
      '@name': 'Organism',
      subtype: 'text',
      key: 'organism',
      value: {
        values: [''],
      },
      required: false,
      helpText: 'The organism on which your experiment acted',
      hint: 'e.g. human'
    }
  },
  'Experiments': {
    '@type': 'element',
    '@name': 'Experiments',
    'description': {
      '@type': 'paragraph',
      '@name': 'Description',
      '@minItems': 0,
      '@maxItems': 2,
      key: 'description',
      value: {
        values: ['', ''],
      },
      helpText: 'Description of project',
      hint: 'Enter the description of your project',
      required: true
    },
    'runs': {
      '@type': 'textfield',
      '@name': 'Run count',
      '@minItems': 0,
      '@maxItems': 2,
      subtype: 'number',
      key: 'runs',
      value: {
        values: ['', ''],
      },
      helpText: 'The number of experimental runs from 4 to 10',
      required: true,
      hint: 'e.g. 5',
      min: 4,
      max: 10
    },
    'contact': {
      '@type': 'element',
      '@name': 'Contact',
      'firstname': {
        '@type': 'textfield',
        '@name': 'First name',
        '@minItems': 0,
        '@maxItems': 1,
        subtype: 'text',
        key: 'first name',
        value: {
          values: [''],
        },
        required: false,
        helpText: 'The first name of your contact'
      },
      'lasttname': {
        '@type': 'textfield',
        '@name': 'Last name',
        subtype: 'text',
        key: 'last name',
        value: {
          values: [''],
        },
        required: false,
        helpText: 'The last name of your contact'
      },
      'email': {
        '@type': 'textfield',
        '@name': 'Email',
        '@minItems': 0,
        '@maxItems': 2,
        subtype: 'email',
        key: 'email',
        value: {
          values: ['', ''],
        },
        helpText: 'Email of contact',
        hint: 'Enter the email address for your contact',
        required: true
      },
      'phone': {
        '@type': 'textfield',
        '@name': 'Phone',
        subtype: 'tel',
        key: 'phone',
        value: {
          values: [''],
        },
        hint: 'e.g. 555-555-1212',
        required: false,
        helpText: 'The phone number of your contact'
      },
      'context': {
        '@type': 'textfield',
        '@name': 'Context',
        subtype: 'text',
        key: 'context',
        value: {
          values: [''],
        },
        required: false,
        helpText: 'The context of your project',
        hint: 'e.g. NCI'
      },
      'classification': {
        '@type': 'textfield',
        '@name': 'Classification',
        subtype: 'text',
        key: 'classification',
        value: {
          values: [''],
        },
        required: false,
        helpText: 'The classification of your project',
        hint: 'e.g. Cancer'
      },
      'address': {
        '@type': 'element',
        '@name': 'Address',
        'phone': {
          '@type': 'textfield',
          '@name': 'Phone',
          subtype: 'tel',
          key: 'phone',
          value: {
            values: [''],
          },
          hint: 'e.g. 555-555-1212',
          required: false,
          helpText: 'The phone number of your contact'
        },
        'context': {
          '@type': 'textfield',
          '@name': 'Context',
          subtype: 'text',
          key: 'context',
          value: {
            values: [''],
          },
          required: false,
          helpText: 'The context of your project',
          hint: 'e.g. NCI'
        },
      }
    },
    'goal': {
      '@type': 'checkbox',
      '@name': 'Goal',
      '@minItems': 0,
      '@maxItems': 1,
      key: 'goal',
      subtype: 'checkbox',
      value: {
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
});


@Injectable()
export class FileDatabase {

  formGroup: FormGroup;
  dataChange = new BehaviorSubject<FileNode[]>([]);


  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.formGroup = new FormGroup({})
    this.initialize(this.formGroup);
  }

  // build the tree of FileNodes
  initialize(formGroup: FormGroup) {
    const dataObject = JSON.parse(TREE_DATA);
    const data = this.buildFileTree(dataObject, 0, formGroup, null);
    this.dataChange.next(data);
  }

  buildFileTree(obj: { [key: string]: any }, level: number, formGroup: FormGroup, parent: FileNode): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {

      const value = obj[key];
      const node = {
        'key': key,
        'name': value['@name'],
        'type': value['@type'],
        'minItems': value['@minItems'],
        'maxItems': value['@maxItems'],
        'itemCount': value['@itemCount']
      };

      node['formGroup'] = formGroup;
      node['parentGroup'] = parent ? parent.formGroup : null;
      node['parent'] = parent;

      if (value['@type'] === 'element') {
        node['parentGroup'] = node['formGroup'];
        node['formGroup'] = new FormGroup({});
        node['children'] = this.buildFileTree(value, level + 1, node['formGroup'], node);
      } else {

        node['subtype'] = value['subtype'];
        node['min'] = value['min'];
        node['max'] = value['max'];
        node['options'] = value['options'];
        node['value'] = value['value'];
        node['help'] = value['help'];
        node['required'] = value['required'];
        node['hint'] = value['hint'];
      }


      return (key.charAt(0) === '@') ? accumulator : accumulator.concat(node);

    }, []);
  }


}
