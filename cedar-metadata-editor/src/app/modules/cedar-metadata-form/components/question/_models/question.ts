import { QuestionBase } from './question-base';
import {QuestionService} from "../../../services/question.service";


export class Question {

  questionBases: [QuestionBase<any>];

  constructor(private qs: QuestionService, key?:string, name?:string) {
    this.questionBases = this.qs.getQuestions(key);
    console.log('questionBases',this.questionBases,key)

  }
}
