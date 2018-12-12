import {Component, OnInit} from '@angular/core';

import { FormGroup }  from '@angular/forms';



@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html'
})

export class InstanceComponent implements OnInit {


  // questions: any[];
  formId:string;
  payLoad: string;
  nested:boolean;
  project:FormGroup;


  constructor() {
    // this.formId = 'projectForm';
  }

  ngOnInit() {
    this.formId = 'projectForm';
    this.nested = false;

  }



  // constructor(private templateService: TemplateService,
  //             private formService: FormService,
  //             private uiUtilService: UiUtilService,
  //             private route: ActivatedRoute,
  //             private router: Router) {
  //
  //   this.formService = formService;
  //   this.uiUtilService = uiUtilService;
  //
  //   this.id = this.route.snapshot.paramMap.get('id');
  //   this.templateId = this.route.snapshot.paramMap.get('templateId');
  //   this.form = templateService.getTemplate(this.id, this.templateId);
  //   this.instance = {};
  //   this.page = 0;
  //
  //   this.status = formService.getStatus(this.form);
  //   this.version = formService.getVersion(this.form);
  //   this.name = formService.getTitle(this.form);
  //
  //   uiUtilService.setTemplate(this.status, this.version, this.name);
  // }
  //
  // ngOnInit() {
  //
  //   this.title = 'Metadata Editor';
  //   this.details = {};
  //   this.validationErrors = {};
  //   this.validationResponse = [
  //     {
  //       "type": "biosample",
  //       "template": "biosample",
  //       "action": []
  //     },
  //     {
  //       "type": "airr",
  //       "template": "miairr",
  //       "action": ["validation", "submission"]
  //     },
  //     {
  //       "type": "lincs",
  //       "template": "dsgc dataset template 1.0",
  //       "action": ["validation"]
  //     }
  //   ];
  //
  //
  //   // permissions
  //   //
  //   //this.saveButtonDisabled = false;
  //
  //   // routing
  //   //
  //   //this.$location = $location;
  //   //   if (!angular.isUndefined($routeParams.templateId)) {
  //   //     getTemplate();
  //   //   }
  //   //
  //   //   if (!angular.isUndefined($routeParams.id)) {
  //   //     getInstance();
  //   //   }
  //   //
  //   //
  //
  //
  //   //   validation
  //   //
  //   //   $on('validationError', function (event, args) {
  //   //     var operation = args[0];
  //   //     var title = args[1];
  //   //     var id = args[2];
  //   //     var error = args[3];
  //   //     var key = id;
  //   //
  //   //     if (operation == 'add') {
  //   //       $scope.validationErrors[error] = $scope.validationErrors[error] || {};
  //   //       $scope.validationErrors[error][key] = {};
  //   //       $scope.validationErrors[error][key].title = title;
  //   //     }
  //   //
  //   //     if (operation == 'remove') {
  //   //       if ($scope.validationErrors[error] && $scope.validationErrors[error][key]) {
  //   //         delete $scope.validationErrors[error][key];
  //   //
  //   //         if (!$scope.hasKeys($scope.validationErrors[error])) {
  //   //           delete $scope.validationErrors[error];
  //   //         }
  //   //       }
  //   //     }
  //   // }
  // };

  // create a copy of the form with the _tmp fields stripped out
  cleanForm = function (model) {

    let copy = Object.assign({}, model);
    if (copy) {
      this.formService.stripTmps(copy);
    }
    //UIUtilService.toRDF();
    return copy;
  };

  // toRDF = function () {
  //   var jsonld = require('jsonld');
  //   var copiedForm = jQuery.extend(true, {}, $scope.model);
  //   if (copiedForm) {
  //     jsonld.toRDF(copiedForm, {format: 'application/nquads'}, function (err, nquads) {
  //       $scope.metaToRDFError = err;
  //       $scope.metaToRDF = nquads;
  //       return nquads;
  //     });
  //   }
  // };

  // getRDF = function () {
  //   return UIUtilService.getRDF();
  // };
  //
  // getRDFError = function () {
  //   var result = $translate.instant('SERVER.RDF.SaveFirst');
  //   if ($scope.metaToRDFError) {
  //     result = $scope.metaToRDFError.details.cause.message;
  //   }
  //   return result;
  // };

  //
  // permissions
  //

  // canWrite = function(details) {
  //   return  resourceService.canWrite(details);
  // };


  //
  // validation
  //
//
//   getValidationHeader = function (key) {
//     //return $translate.instant('VALIDATION.groupHeader.' + key);
//   };
//
//   hasKeys = function (value) {
//     return Object.keys(value).length;
//   };
//
//   //
//   // custom validation services
//   //
//
//   isValidationTemplate = function (action) {
//     var result;
//     if ($rootScope.documentTitle) {
//       result = ValidationService.isValidationTemplate($rootScope.documentTitle, action);
//     }
//     return result;
//   };
//
//   doValidation = function () {
//     var type = ValidationService.isValidationTemplate($rootScope.documentTitle, 'validation');
//     if (type) {
//       $scope.$broadcast('external-validation', [type]);
//     }
//   };
//
//

  // read/write template and instances
  //
  // Get template with given id from $routeParams
  // getTemplate = function () {
  //   AuthorizedBackendService.doCall(
  //     TemplateService.getTemplate($routeParams.templateId),
  //     function (response) {
  //       // Assign returned form object from FormService to $scope.form
  //       $scope.form = response.data;
  //       UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
  //       UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
  //       $rootScope.jsonToSave = $scope.form;
  //       $rootScope.rootElement = $scope.form;
  //       HeaderService.dataContainer.currentObjectScope = $scope.form;
  //       $rootScope.documentTitle = $scope.form['schema:name'];
  //
  //       // Initialize value recommender service
  //       ValueRecommenderService.init($routeParams.templateId, $scope.form);
  //
  //     },
  //     function (err) {
  //       console.log('err', err);
  //       var message = (err.data.errorKey == 'noReadAccessToResource') ? 'Whoa!' : $translate.instant(
  //         'SERVER.TEMPLATE.load.error');
  //
  //       UIMessageService.acknowledgedExecution(
  //         function () {
  //           $timeout(function () {
  //             $rootScope.goToHome();
  //           });
  //         },
  //         'GENERIC.Warning',
  //         message,
  //         'GENERIC.Ok');
  //     });
  //
  // };

  // create a copy of the form with the _tmp fields stripped out
  // cleanForm = function () {
  //   var copiedForm = jQuery.extend(true, {}, $scope.instance);
  //   if (copiedForm) {
  //     DataManipulationService.stripTmps(copiedForm);
  //   }
  //
  //   UIUtilService.toRDF();
  //   $scope.RDF = UIUtilService.getRDF();
  //   $scope.RDFError = UIUtilService.getRDFError();
  //   return copiedForm;
  // };

//
//   $scope.details;
//   $scope.cannotWrite;
//
//

//
//

//
//   // This function watches for changes in the _ui.title field and autogenerates the schema title and description fields
//   $scope.$watch('cannotWrite', function () {
//     UIUtilService.setLocked($scope.cannotWrite);
//   });
//
//   var getDetails = function (id) {
//     if (id) {
//       resourceService.getResourceDetailFromId(
//         id, CONST.resourceType.INSTANCE,
//         function (response) {
//           $scope.details = response;
//           $scope.canWrite();
//         },
//         function (error) {
//           UIMessageService.showBackendError('SERVER.INSTANCE.load.error', error);
//         }
//       );
//     }
//   };
//
//
//   // Get/read instance with given id from $routeParams
//   // Also read the template for it
//   $scope.getInstance = function () {
//     AuthorizedBackendService.doCall(
//       TemplateInstanceService.getTemplateInstance($routeParams.id),
//       function (instanceResponse) {
//         $scope.instance = instanceResponse.data;
//         ValidationService.checkValidation();
//         UIUtilService.instanceToSave = $scope.instance;
//         $scope.isEditData = true;
//         $rootScope.documentTitle = $scope.instance['schema:name'];
//         getDetails($scope.instance['@id']);
//
//
//         AuthorizedBackendService.doCall(
//           TemplateService.getTemplate(instanceResponse.data['schema:isBasedOn']),
//           function (templateResponse) {
//             // Assign returned form object from FormService to $scope.form
//             $scope.form = templateResponse.data;
//             $rootScope.jsonToSave = $scope.form;
//             // Initialize value recommender service
//             var templateId = instanceResponse.data['schema:isBasedOn'];
//             ValueRecommenderService.init(templateId, $scope.form);
//             UIUtilService.setStatus($scope.form[CONST.publication.STATUS]);
//             UIUtilService.setVersion($scope.form[CONST.publication.VERSION]);
//           },
//           function (err) {
//             // UIMessageService.showBackendError('SERVER.TEMPLATE.load-for-instance.error', templateErr);
//             var message = (err.data.errorKey == 'noReadAccessToResource') ? $translate.instant(
//               'SERVER.TEMPLATE.load.error-template') : $translate.instant('SERVER.TEMPLATE.load.error');
//             UIMessageService.acknowledgedExecution(
//               function () {
//                 $timeout(function () {
//                   $rootScope.goToHome();
//                 });
//               },
//               'GENERIC.Warning',
//               message,
//               'GENERIC.Ok');
//
//           }
//         );
//       },
//       function (instanceErr) {
//         UIMessageService.showBackendError('SERVER.INSTANCE.load.error', instanceErr);
//         $rootScope.goToHome();
//       }
//     );
//   };
//
//
// // Stores the data (instance) into the databases
//   $scope.saveInstance = function () {
//
//     var doSave = function (response) {
//       ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
//       UIMessageService.flashSuccess('SERVER.INSTANCE.create.success', null, 'GENERIC.Created');
//
//       //$rootScope.$broadcast("form:clean");
//       UIUtilService.setDirty(false);
//       $rootScope.$broadcast(CONST.eventId.form.VALIDATION, {state: true});
//
//       $timeout(function () {
//         var newId = response.data['@id'];
//         $location.path(FrontendUrlService.getInstanceEdit(newId));
//       });
//
//       $timeout(function () {
//         // don't show validation errors until after any redraws are done
//         // thus, call this within a timeout
//         $rootScope.$broadcast('submitForm');
//       }, 1000);
//
//     };
//
//     var doUpdate = function (response) {
//       ValidationService.logValidation(response.headers("CEDAR-Validation-Status"));
//       UIMessageService.flashSuccess('SERVER.INSTANCE.update.success', null, 'GENERIC.Updated');
//       $rootScope.$broadcast("form:clean");
//       $rootScope.$broadcast('submitForm');
//       owner.enableSaveButton();
//     };
//
//     this.disableSaveButton();
//     var owner = this;
//
//     $scope.runtimeErrorMessages = [];
//     $scope.runtimeSuccessMessages = [];
//
//     if ($scope.instance['@id'] == undefined) {
//       // '@id' and 'templateId' haven't been populated yet, create now
//       // $scope.instance['@id'] = $rootScope.idBasePath + $rootScope.generateGUID();
//       $scope.instance['schema:isBasedOn'] = $routeParams.templateId;
//       // Create fields that will store information used by the UI
//       $scope.instance['schema:name'] = $scope.form['schema:name'] + $translate.instant("GENERATEDVALUE.instanceTitle")
//       $scope.instance['schema:description'] = $scope.form['schema:description'] + $translate.instant(
//         "GENERATEDVALUE.instanceDescription");
//       // Make create instance call
//       AuthorizedBackendService.doCall(
//         TemplateInstanceService.saveTemplateInstance(
//           (QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId()), $scope.instance),
//         function (response) {
//           doSave(response);
//         },
//         function (err) {
//
//           if (err.data.errorKey == "noWriteAccessToFolder") {
//             AuthorizedBackendService.doCall(
//               TemplateInstanceService.saveTemplateInstance(CedarUser.getHomeFolderId(), $scope.instance),
//               function (response) {
//
//                 doSave(response);
//                 UIMessageService.flashWarning('SERVER.INSTANCE.create.homeFolder');
//
//               },
//               function (err) {
//                 UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
//                 owner.enableSaveButton();
//               }
//             );
//
//           } else {
//             UIMessageService.showBackendError('SERVER.INSTANCE.create.error', err);
//             owner.enableSaveButton();
//           }
//         }
//       );
//     }
//     // Update instance
//     else {
//       AuthorizedBackendService.doCall(
//         TemplateInstanceService.updateTemplateInstance($scope.instance['@id'], $scope.instance),
//         function (response) {
//           doUpdate(response);
//         },
//         function (err) {
//           UIMessageService.showBackendError('SERVER.INSTANCE.update.error', err);
//           owner.enableSaveButton();
//         }
//       );
//     }
//   };
//
//
//
// getValidationHeader = function (key) {
//   return $translate.instant('VALIDATION.groupHeader.' + key);
// };
//
// hasKeys = function (value) {
//   return Object.keys(value).length;
// };
//
//
// // cancel the form and go back to folder
// cancelTemplate = function () {
//   $location.url(FrontendUrlService.getFolderContents(QueryParamUtilsService.getFolderId()));
// };
//
// enableSaveButton = function () {
//   $timeout(function () {
//     $scope.saveButtonDisabled = false;
//   }, 1000);
// };
//
// disableSaveButton = function () {
//   $scope.saveButtonDisabled = true;
// };
//
// //
// // custom validation services
// //
//
// isValidationTemplate = function (action) {
//   var result;
//   if ($rootScope.documentTitle) {
//     result = ValidationService.isValidationTemplate($rootScope.documentTitle, action);
//   }
//   return result;
// };
//
// doValidation = function () {
//   var type = ValidationService.isValidationTemplate($rootScope.documentTitle, 'validation');
//   if (type) {
//     $scope.$broadcast('external-validation', [type]);
//   }
// };
//


}
