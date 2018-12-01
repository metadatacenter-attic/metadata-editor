import { QuestionBase } from './question-base';

export class ElementQuestion extends QuestionBase<string> {
  controlType = 'element';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

