import {FormGroup} from '@angular/forms';


import {MetadataModel} from './metadata-model';
import {InputType} from "../models/input-type";



export interface FileNode {
  key: string;
  name: string;

  minItems?: number;
  maxItems?: number;
  itemCount?: number;

  type?: InputType;
  subtype?: InputType;

  formGroup?: FormGroup;
  parent?: FileNode;
  parentGroup?: FormGroup;
  children?: FileNode[];

  help?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  decimals?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  multipleChoice?: boolean;

  options?: any;
  value?: any[];
  label?: any[];
  size?:any;

  model?:MetadataModel;
  valueLocation?:string;
  valueConstraints?:any;
}
