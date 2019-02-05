import {Injectable} from '@angular/core';



export enum InputType {
  textfield = 'textfield',
  link = 'link',
  textarea = 'textarea',
  radio = 'radio',
  checkbox = 'checkbox',
  date = 'date',
  email = 'email',
  list = 'list',
  numeric = 'numeric',
  phoneNumber = 'phone-number',
  attributeValue = 'attribute-value',
  pageBreak = 'page-break',
  sectionBreak = 'section-break',
  richText = 'richtext',
  image = 'image',
  youTube = 'youtube'
}

const INPUT_TYPES = JSON.stringify({
    'textfield': {
      'cedarType': 'textfield',
      'iconClass': 'fa fa-font',
      'label': 'Text',
      'allowedInElement': true,
      'primaryField': true,
      'hasControlledTerms': true,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': true,
      'hasInstanceTerm': true,
      'allowsRequired': true
    },
    'link': {
      'cedarType': 'link',
      'iconClass': 'fa fa-font',
      'label': 'Text',
      'allowedInElement': true,
      'primaryField': true,
      'hasControlledTerms': true,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': true,
      'hasInstanceTerm': true,
      'allowsRequired': true
    },
    'textarea': {
      'cedarType': 'textarea',
      'iconClass': 'fa fa-paragraph',
      'label': 'Text Area',
      'allowedInElement': true,
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'radio': {
      'cedarType': 'radio',
      'iconClass': 'fa fa-dot-circle-o',
      'label': 'Multiple Choice',
      'allowedInElement': true,
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'checkbox': {
      'cedarType': 'checkbox',
      'iconClass': 'fa fa-check-square-o',
      'label': 'Checkbox',
      'allowedInElement': true,
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'date': {
      'cedarType': 'date',
      'iconClass': 'fa fa-calendar',
      'label': 'Date',
      'allowedInElement': true,
      'primaryField': true,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'email': {
      'cedarType': 'email',
      'iconClass': 'fa fa-envelope',
      'label': 'Email',
      'allowedInElement': true,
      'primaryField': true,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'list': {
      'cedarType': 'list',
      'iconClass': 'fa fa-list',
      'allowedInElement': true,
      'primaryField': false,
      'label': 'List',
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'numeric': {
      'cedarType': 'numeric',
      'iconClass': 'fa fa-hashtag',
      'allowedInElement': true,
      'primaryField': true,
      'Label': 'Number',
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'phone-number': {
      'cedarType': 'phone-number',
      'iconClass': 'fa fa-th',
      'allowedInElement': true,
      'label': 'Phone Number',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': true,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': true
    },
    'attribute-value': {
      'cedarType': 'attribute-value',
      'iconClass': 'fa fa-plus-square',
      'label': 'Attribute Value',
      'allowedInElement': true,
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': false,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    },
    'page-break': {
      'cedarType': 'page-break',
      'iconClass': 'fa fa-file-o',
      'allowedInElement': false,
      'label': 'Page Break',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': true,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    },
    'section-break': {
      'cedarType': 'section-break',
      'iconClass': 'fa fa-minus',
      'allowedInElement': true,
      'label': 'Section Break',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': true,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    },
    'richtext': {
      'cedarType': 'richtext',
      'iconClass': 'fa fa-pencil-square-o',
      'allowedInElement': true,
      'label': 'Rich Text',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': true,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    },
    'image': {
      'cedarType': 'image',
      'iconClass': 'fa fa-image',
      'allowedInElement': true,
      'label': 'Image',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': true,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    },
    'youtube': {
      'cedarType': 'youtube',
      'iconClass': 'fa fa-youtube-square',
      'allowedInElement': true,
      'label': 'YouTube Video',
      'primaryField': false,
      'hasControlledTerms': false,
      'staticField': true,
      'allowsMultiple': false,
      'allowsValueRecommendation': false,
      'hasInstanceTerm': false,
      'allowsRequired': false
    }
  });


@Injectable()
export class InputTypeService {

  private config: object;



  constructor() {
    this.config = JSON.parse(INPUT_TYPES);
  }

  isStatic(t: InputType) {
    return this.config[t].staticField;
  }

  isNotTextInput(t:string) {
    return t === InputType.list || t === InputType.radio  || t === InputType.checkbox || t === InputType.date  || t === InputType.textarea;
  }

  isCheckbox(t:string) {
    return t === InputType.checkbox;
  }

  isRadio(t:string) {
    return t === InputType.radio;
  }

  isList(t:string) {
    return t === InputType.list;
  }

}
