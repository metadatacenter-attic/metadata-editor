import {Injectable} from '@angular/core';


import {TextboxQuestion} from '../question/_models/question-textbox';
import {StaticQuestion} from '../question/_models/question-static';
import {ElementQuestion} from '../question/_models/question-element';
import {DropdownQuestion} from '../question/_models/question-dropdown';

@Injectable()
export class QuestionService {

  questions = {
    "projectForm": [


      new ElementQuestion({
        name:"element",
        type: 'element',
        id: "mno",
        key: 'project',
        label: 'Project',
        help: 'Help With Project',
        order: 2,
        element:null
      }),


      new TextboxQuestion({
        name:"PI name",
        key: 'PI name',
        id: "ghi",
        label: 'PI name',
        value: 'PI name',
        required: true,
        order: 4
      }),

      new TextboxQuestion({
        name: 'PI email',
        key: 'PI email Address',
        id: "jkl",
        label: 'PI Email',
        value: 'PI email',
        type: 'textbox',
        required: true,
        order: 5
      }),

      new ElementQuestion({
        name: "mno",
        type: 'element',
        id: "mno",
        key: 'subject',
        label: 'Subjects',
        help: 'Help With Subjects',
        order: 6,
        element:null
      })


    ],
    "project":  [

      new StaticQuestion({
        name: "stquest",
        type: 'section-break',
        key: 'ProjectHeader',
        required: false,
        value:'project header',
        id: "abc",
        label: 'Project',
        help: 'Help With Project',
        order: 1
      }),

      new TextboxQuestion({
        name: "project name",
        key: 'projectName',
        id: "789",
        label: 'ProjectName',
        value: 'project name',
        required: true,
        order: 2
      }),
      new TextboxQuestion({
        name: "project type",
        key: 'projectType',
        id: "789",
        label: 'Project Type',
        value: 'project type',
        required: true,
        order: 3
      })
    ],
    "subject":  [

      new StaticQuestion({
        name: "another static break",
        type: 'section-break',
        id: "123",
        key: 'Subject',
        label: 'Enter Subjects',
        help: 'Help With Subjects',
        order: 1
      }),

      new DropdownQuestion({
        name: "dropdown",
        key: 'brave',
        id: "456",
        required: true,
        label: 'Subject Rating',
        options: [
          {key: 'solid', value: 'Solid'},
          {key: 'great', value: 'Great'},
          {key: 'good', value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 2
      }),

      new TextboxQuestion({
        name: "another first name",
        key: 'firstName',
        id: "789",
        label: 'First name',
        value: 'subject first name',
        required: true,
        order: 3
      }),

      new TextboxQuestion({
        name: "another email",
        key: 'emailAddress',
        id: "101112",
        label: 'Email',
        type: 'email',
        order: 4
      })

    ],
    "experiment" :[

      new StaticQuestion({
        name: "yet another static break",
        type: 'section-break',
        id: "123",
        required: true,
        key: 'Experiments',
        label: 'Experiments',
        help: 'Help With Experiments',
        order: 1
      }),

      new DropdownQuestion({
        name: "another drop break",
        key: 'brave',
        id: "456",
        required: true,
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
        name: "another text break",
        key: 'firstName',
        id: "789",
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 4
      }),

      new TextboxQuestion({
        name: "another static break",
        key: 'emailAddress',
        id: "101112",
        label: 'Email',
        type: 'email',
        required: true,
        order: 2
      })
    ],
    "contact" :[

      new TextboxQuestion({
        name: "firstName",
        key: 'firstName',
        id: "789",
        label: 'First name',
        value: '',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        name: "emailAddress",
        key: 'emailAddress',
        id: "101112",
        label: 'Email',
        type: 'email',
        required: true,
        order: 2
      })
    ]
  };

  // TODO: get from a remote source of questions
  getQuestions(key:string) {
    if (key && this.questions[key]) {
      let q  = this.questions[key];
      return q.sort((a, b) => a.order - b.order);
    }
  }


}
