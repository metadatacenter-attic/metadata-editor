import { QuestionBase } from './question-base';

export class StaticQuestion extends QuestionBase<string> {
  controlType = 'static';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
