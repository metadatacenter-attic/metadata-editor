import {FormGroup} from '@angular/forms';



export class FileNode {
  key: string;
  name: string;
  minItems: number;
  maxItems: number;
  itemCount: number;
  type: string;
  subtype: string;
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
