import {FormGroup} from '@angular/forms';

import {InputType} from './input-types';


export class FileNode {
  key: string;
  name: string;
  minItems: number;
  maxItems: number;
  itemCount: number;
  type: InputType;
  subtype: InputType;
  help: string;
  required: boolean;
  hint: string;
  min: number;
  max: number;
  minLength: number;
  maxLength: number;
  pattern: string;
  options: any;
  value: {
    values: any[];
  };
  formGroup: FormGroup;
  parent: FileNode;
  parentGroup: FormGroup;
  children: FileNode[];


}
