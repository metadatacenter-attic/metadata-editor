import {Injectable} from '@angular/core';

import {DropdownQuestion} from './question-dropdown';
import {QuestionBase} from './question-base';
import {TextboxQuestion} from './question-textbox';
import {StaticQuestion} from './question-static';
import {ElementQuestion} from './question-element';

@Injectable()
export class QuestionService {

  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQuestions() {

    let questions: QuestionBase<any>[] = [

      new StaticQuestion({
        type: 'section-break',
        key: 'Section One',
        label: 'Section One Label',
        help: 'Help With Section One',
        order: 1
      }),

      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid', value: 'Solid'},
          {key: 'great', value: 'Great'},
          {key: 'good', value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 4
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      }),

      new ElementQuestion({
        type: 'element',
        key: 'study',
        label: 'Study',
        help: 'Help With Study',
        order: 5,
        questions: [

          new TextboxQuestion({
            key: 'city',
            label: 'City',
            value: 'Palo Alto',
            required: true,
            order: 1
          }),

          new TextboxQuestion({
            key: 'state',
            label: 'State',
            value: 'CA',
            required: true,
            order: 2
          }),

          new TextboxQuestion({
            key: 'zip',
            label: 'Zip',
            type: 'zip',
            order: 3
          })
          ]
      })


    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
