import {FormGroup} from "@angular/forms";
import {ValueArray} from "./value-array";


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
  subtype: string;
  name: string;
  options: any;
  value: ValueArray;
  formGroup: FormGroup;
  elementGroup: FormGroup;
  children: FileNode[];
  parent:FileNode;

}
