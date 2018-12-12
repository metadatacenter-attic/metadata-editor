import {FormGroup} from "@angular/forms";

export class QuestionBase<T> {
  value: T;
  id:string;
  key: string;
  label: string;
  name:string;
  required: boolean;
  order: number;
  controlType: string;
  element:FormGroup;
  questions:QuestionBase<T>[];
  visible:boolean;

  constructor(options: {
    value?: T,
    id?:string,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string,
    element?: FormGroup;
    questions?:QuestionBase<T>[];
    visible?:boolean;
  } = {}) {
    this.value = options.value;
    this.id = options.id || '';
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.element = options.element || null;
    this.visible = true;
  }
}
