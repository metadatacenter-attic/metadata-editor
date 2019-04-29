import {FormGroup} from "@angular/forms";

export class QuestionBase<T> {
  name:string;
  type:string;
  key: string;
  value: string;

  id:string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;


  constructor(options: {
    name?:string;
    type?:string;
    key?: string;
    value?: string;

    id?:string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,

  } = {}) {
    this.name = options.name;
    this.type = options.type || '';
    this.value = options.value;
    this.key = options.key || '';

    this.id = options.id || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';

  }
}
