import { Injectable } from '@angular/core';

import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validationTypes: object;
  resourceType: object;


  constructor(private formService: FormService) {
    this.validationTypes = [
      {
        "type": "biosample",
        "template": "biosample",
        "action": []
      },
      {
        "type": "airr",
        "template": "miairr",
        "action": ["validation", "submission"]
      },
      {
        "type": "lincs",
        "template": "dsgc dataset template 1.0",
        "action": ["validation"]
      }
    ];
    this.resourceType = {
      'https://schema.metadatacenter.org/core/Template': 'template',
      'https://schema.metadatacenter.org/core/TemplateField': 'field',
      'https://schema.metadatacenter.org/core/TemplateElement': 'element',
    };
  }

  getValidationTypes = function () {
    return this.validationTypes;
  };

  /* is this a template that has an external validation service */
  isValidationTemplate = function (value, action) {
    let result;
    if (value) {
      var template = value.toLowerCase();
      this.validationTypes.forEach(function (item, index, array) {
        if (template.indexOf(item.template) > -1) {
          if (item.action.includes(action)) {
            result = item.type;
          }
        }
      });
    }
    return result;
  };

  /* TODO validate the template */
  checkValidation = function (template) {

    let node = Object.assign({}, template);

    if (node) {
      this.formService.stripTmps(node);
      this.formService.updateKeys(node);

      if (node['@type'] && this.resourceType[node['@type']]) {
        // return resourceService.validateResource(
        //   node, this.resourceType[node['@type']],
        //   function (response) {
        //     logValidation(response.validates, angular.toJson(response));
        //   },
        //   function (error) {
        //     UIMessageService.showBackendError('SERVER.FOLDER.load.error', error);
        //   }
        // );
      }
    }
  };

  /* report validation status, errors and warnings */
  logValidation = function (status, report) {

    // tell everybody about the validation status
    //$rootScope.$broadcast(CONST.eventId.form.VALIDATION, {state: status});

    // try to parse the report
    if (report) {
      var r;

      try {
        r = JSON.parse(report);
      } catch (e) {
        console.log(e); // error in the above string!
      }


      if (r) {
        if (r.warnings) {
          for (var i = 0; i < r.warnings.length; i++) {
            console.log(
              'Validation Warning: ' + r.warnings[i].message + ' at location ' + r.warnings[i].location);
          }
        }
        if (r.errors) {
          for (var i = 0; i < r.errors.length; i++) {
            console.log('Validation Error: ' + r.errors[i].message + ' at location ' + r.errors[i].location);
          }
        }
      }
    }

  };


}
