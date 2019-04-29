import {QuestionBase} from "../components/question/_models/question-base";
import {QuestionService} from "../services/question.service";


export class Template {

  name: string;
  key:string;
  questions: [QuestionBase<any>];

  constructor(private qs: QuestionService, key?: string, name?:string) {
    this.questions = this.qs.getQuestions(key);
    this.name = name;
    this.key = key;
  }
}
