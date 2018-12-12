import { QuestionBase } from './question-base';


export class ElementQuestion extends QuestionBase<string> {
  controlType = 'element';
  type: string;

  constructor(options: {} ) {
    super(options);
    this.type = options['type'] || '';
    this.element = null;
    this.questions = null;
    this.visible = false;

  }

  get isValid() {
      return this.element ? this.element.valid : false;
  }
}

