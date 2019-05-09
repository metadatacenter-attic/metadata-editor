import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FieldTypeService {

  fieldTypes: Array<object>;
  primaryFieldTypes: Array<object>;
  otherFieldTypes: Array<object>;


  constructor() {
    this.fieldTypes = [
      {
        "cedarType": "textfield",
        "iconClass": "fa fa-font",
        "label": "Text",
        "allowedInElement": true,
        "primaryField": true,
        "hasControlledTerms": true,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": true,
        "hasInstanceTerm": true,
        "allowsRequired": true
      },
      {
        "cedarType": "link",
        "iconClass": "fa fa-link",
        "label": "link",
        "allowedInElement": true,
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": true,
        "allowsRequired": true
      },
      {
        "cedarType": "textarea",
        "iconClass": "fa fa-paragraph",
        "label": "Text Area",
        "allowedInElement": true,
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "radio",
        "iconClass": "fa fa-dot-circle-o",
        "label": "Multiple Choice",
        "allowedInElement": true,
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "checkbox",
        "iconClass": "fa fa-check-square-o",
        "label": "Checkbox",
        "allowedInElement": true,
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "date",
        "iconClass": "fa fa-calendar",
        "label": "Date",
        "allowedInElement": true,
        "primaryField": true,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "email",
        "iconClass": "fa fa-envelope",
        "label": "Email",
        "allowedInElement": true,
        "primaryField": true,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "list",
        "iconClass": "fa fa-list",
        "allowedInElement": true,
        "primaryField": false,
        "label": "List",
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "numeric",
        "iconClass": "fa fa-hashtag",
        "allowedInElement": true,
        "primaryField": true,
        "Label": "Number",
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "phone-number",
        "iconClass": "fa fa-th",
        "allowedInElement": true,
        "label": "Phone Number",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": true,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": true
      },
      {
        "cedarType": "attribute-value",
        "iconClass": "fa fa-plus-square",
        "label": "Attribute Value",
        "allowedInElement": true,
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": false,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      },
      {
        "cedarType": "page-break",
        "iconClass": "fa fa-file-o",
        "allowedInElement": false,
        "label": "Page Break",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": true,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      },
      {
        "cedarType": "section-break",
        "iconClass": "fa fa-minus",
        "allowedInElement": true,
        "label": "Section Break",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": true,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      },
      {
        "cedarType": "richtext",
        "iconClass": "fa fa-pencil-square-o",
        "allowedInElement": true,
        "label": "Rich Text",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": true,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      },
      {
        "cedarType": "image",
        "iconClass": "fa fa-image",
        "allowedInElement": true,
        "label": "Image",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": true,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      },
      {
        "cedarType": "youtube",
        "iconClass": "fa fa-youtube-square",
        "allowedInElement": true,
        "label": "YouTube Video",
        "primaryField": false,
        "hasControlledTerms": false,
        "staticField": true,
        "allowsMultiple": false,
        "allowsValueRecommendation": false,
        "hasInstanceTerm": false,
        "allowsRequired": false
      }
    ];
    this.primaryFieldTypes = [];
    this.otherFieldTypes = [];

    // find the fields that are in the toolbar
    for (let ft in this.fieldTypes) {
      if (this.fieldTypes[ft]['primaryField']) {
        this.primaryFieldTypes.push(this.fieldTypes[ft]);
      } else {
        this.otherFieldTypes.push(this.fieldTypes[ft]);
      }
    }
  }

  getFieldTypes() {
    return this.fieldTypes;
  };

  getPrimaryFieldTypes() {
    return this.primaryFieldTypes;
  };

  getOtherFieldTypes() {
    return this.otherFieldTypes;
  };

  isStaticField(fieldType:string) {
    for (let ft in this.fieldTypes) {
      if (this.fieldTypes[ft]['cedarType'] == fieldType) {
        return this.fieldTypes[ft]['staticField'];
      }
    }
    return false;
  };

  isAttributeValueField(fieldType) {
    return fieldType == 'attribute-value';
  };

  getFieldIconClass(fieldType) {
    for (let ft in this.fieldTypes) {
      if (this.fieldTypes[ft]['cedarType'] == fieldType) {
        return this.fieldTypes[ft]['iconClass'];
      }
    }
    return false;
  };


}
