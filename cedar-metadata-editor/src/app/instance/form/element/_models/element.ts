import { QuestionBase } from '../../question/_models/question-base';
import { QuestionService } from '../../service/question.service';


export class Element {
  key:string;
  name: string;
  questions: [QuestionBase<any>];

  constructor(private qs: QuestionService, key?: string, name?:string) {
    this.questions = this.qs.getQuestions(key);
    this.name = name;
    this.key = key;
  }
}
