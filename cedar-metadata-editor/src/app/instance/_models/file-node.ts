import {FormGroup} from '@angular/forms';

import {InputType} from './input-types';


export interface FileNode {
  key: string;
  name: string;
  minItems: number;
  maxItems: number;
  itemCount: number;

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

  model?:any;
  valueLocation?:string;
}
