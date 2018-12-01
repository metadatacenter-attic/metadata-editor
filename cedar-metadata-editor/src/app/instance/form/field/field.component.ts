import {Component, Input, OnInit} from '@angular/core';

import {FormService} from '../../../form.service';
import {UiUtilService} from '../../../ui-util.service';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.less']
})
export class FieldComponent implements OnInit {

  @Input('parent') parent: object;
  @Input('model') parentModel: object;
  @Input('key') key: string;

  field: object;
  model: object;
  index: number;
  path: string;
  uid: string;
  data: object;

  constructor(private formService:FormService, private uiUtilService:UiUtilService) {
    this.formService = formService;
    this.uiUtilService = uiUtilService;
  }

  ngOnInit() {
    this.field = this.parent['properties'][this.key];
    this.model = this.parentModel[this.key];
    console.log('this.field',this.key, this.field, this.parent, this.model);

    this.setValueArray();
    // this.viewState = this.uiUtilService.createViewState(this.field, this.switchToSpreadsheet,
    //   this.cleanupSpreadsheet);

  }


  forms = {};
  viewState;
  pageMin = 0;
  pageMax = 0;
  pageRange = 6;
  valueArray;


  /* put values of multi-instance fields into an array for editing */
  setValueArray = function () {

    this.valueArray = [];
    this.data = {"info": []};
    this.model = this.model || {};

    switch (this.formService.getInputType(this.field)) {
      case "checkbox":
      case "radio":
      case "list":
        this.valueArray.push(this.model);
        break;
      case "attribute-value":
        for (let i = 0; i < this.model.length; i++) {
          this.valueArray.push({'@value': this.model[i]})
        }
        break;
      case "numeric":
        for (let i = 0; i < this.valueArray.length; i++) {
          let value;
          if (this.valueArray[i]) {
            value = Number.parseFloat(this.valueArray[i]['@value']);
          }
          this.data.info[i] = {'value': value};
        }
        break;
      default:
        if (this.model instanceof Array) {
          this.valueArray = this.model;

        } else {
          this.valueArray.push(this.model);
        }
    }
  };


//   // Retrieve appropriate field template file
//   getFieldUrl = function () {
//     return 'scripts/form/runtime-field' + '/' + this.formService.getInputType() + '.html';
//   };
//
//   getNumericPlaceholder = function (field) {
//   };
//
//
//
//   // handle the ng-pattern validation for numbers
//   handlePattern = (function () {
//       if (this.formService.isNumericType(this.field)) {
//         let regexp;
//         let places = this.formService.getDecimalPlace(this.field);
//         let countDecimals = function (value) {
//           let result = 0;
//           let arr = value.toString().split(".");
//           if (arr.length > 1) {
//             result = arr[1].length;
//           }
//
//           return result;
//         };
//
//         switch (this.formService.getNumberType(this.field)) {
//           case "xsd:long":
//           case "xsd:int":
//             // integer or long int
//             regexp = /^-?[0-9][^\.]*$/;
//             break;
//           case "xsd:decimal":
//           case "xsd:float":
//           case "xsd:double":
//             // single or double precision real
//             regexp = /^-?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
//             break;
//         }
//
//         return {
//           test: function (value) {
//             if (places) {
//               // TODO shouldn't have to count places here, regexp should handle correctly using {0,places} but it is not working
//               return regexp.test(value) && countDecimals(value) <= places;
//             } else {
//               return regexp.test(value);
//             }
//
//           }
//         };
//       }
//     }
//   )();
//
//   // get the step amount for decimal numbers
//   getStep = function (field) {
//     let result = 'any';
//     let places = this.formService.getDecimalPlace(this.field);
//     let type = this.formService.getNumberType(this.field);
//     switch (type) {
//       case "xsd:decimal":
//       case "xsd:long":
//       case "xsd:int":
//       case "xsd:float":
//       case "xsd:double":
//         // single or double precision real
//         if (places) {
//           result = '0.' + '0'.repeat(places - 1) + '1';
//         }
//         break;
//     }
//     return result;
//
//   };
//
//
//   // string together field values
//   getValueString = function (valueElement, attributeValueElement) {
//     var result = '';
//     if (this.formService.isAttributeValueType(this.field)) {
//       if (valueElement) {
//         for (var i = 0; i < valueElement.length; i++) {
//           result += valueElement[i]['@value'] + (attributeValueElement[i]['@value'] ? '=' + attributeValueElement[i]['@value'] : '') + ', ';
//         }
//       }
//     } else {
//       var location = this.formService.getValueLabelLocation(this.field, valueElement);
//       if (valueElement) {
//         for (var i = 0; i < valueElement.length; i++) {
//           if (valueElement[i][location] && valueElement[i][location] != 'null') {
//             result += valueElement[i][location] + ', ';
//           }
//         }
//       }
//     }
//     return result.trim().replace(/,\s*$/, "");
//   };
//
//   // string together field values
//   getValue = function () {
//
//     if ($scope.isRegular() && $scope.isListView()) {
//       return $scope.valueArray[$scope.index]['@value'];
//     }
//     if ($scope.isRegular() && !$scope.isListView()) {
//       return $scope.getValueString($scope.valueArray);
//     }
//     if ($scope.isConstrained() && $scope.isListView()) {
//       return $scope.valueArray[$scope.index]['rdfs:label'];
//     }
//     if ($scope.isConstrained() && $scope.isListView()) {
//       return $scope.valueArray[$scope.index]['rdfs:label'];
//     }
//     if ($scope.isConstrained() && !$scope.isListView()) {
//       return $scope.getValueString($scope.valueArray);
//     }
//     if ($scope.isRecommended() && $scope.isListView()) {
//       //TODO: pick rdfs:label or @value depending on the existing field value
//       return $scope.valueArray[$scope.index]['rdfs:label'];
//     }
//     if ($scope.isRecommended() && !$scope.isListView()) {
//       return $scope.getValueString($scope.valueArray);
//     }
//   };
//
//   // can this be expanded
//   isExpandable = function () {
//     return false;
//   };
//
//   // is this a field
//   isField = function () {
//     return true;
//   };
//
//   // is this an element
//   isElement = function () {
//     return false;
//   };
//
//   //
//   // field display
//   //
//
//   pageMinMax = function () {
//     $scope.pageMax = Math.min($scope.valueArray.length, $scope.index + $scope.pageRange);
//     $scope.pageMin = Math.max(0, $scope.pageMax - $scope.pageRange);
//   };
//
//   selectPage = function (i) {
//     $scope.onSubmit($scope.index, i);
//   };
//
//   // expand all nested values
//   expandAll = function () {
//   };
//
//   // show this field as a spreadsheet
//   switchToSpreadsheet = function () {
//     $scope.setActive(0, true);
//     if (schemaService.getMaxItems($scope.field)) {
//       // create all the rows if the maxItems is a fixed number
//       $scope.createExtraRows();
//     }
//
//     SpreadsheetService.switchToSpreadsheet($scope, $scope.field, 0, function () {
//       return true;
//     }, function () {
//       $scope.addMoreInput();
//     }, function () {
//       $scope.removeInput($scope.model.length - 1);
//     }, function () {
//       $scope.createExtraRows();
//     }, function () {
//       $scope.deleteExtraRows();
//     })
//   };
//
//   cleanupSpreadsheet = function () {
//     $scope.deleteExtraRows();
//     SpreadsheetService.destroySpreadsheet($scope);
//     $scope.setValueArray();
//   };
//
//   isTabView = function () {
//     return UIUtilService.isTabView($scope.viewState);
//   };
//
//   isListView = function () {
//     return UIUtilService.isListView($scope.viewState);
//   };
//
//   isSpreadsheetView = function () {
//     return UIUtilService.isSpreadsheetView($scope.viewState);
//   };
//
//   // toggle through the list of view states
//   toggleView = function () {
//     $scope.viewState = UIUtilService.toggleView($scope.viewState, $scope.setActive);
//   };
//
//   toggleActive = function (index) {
//     $scope.setActive(index, !$scope.isActive(index));
//   };
//
//   setInactive = function (index) {
//     $scope.setActive(index, false);
//   };
//
//   fullscreen = function () {
//     UIUtilService.fullscreen($scope.getLocator(0));
//   };
//
//   // set this field and index active
//   setActive = function (idx, value) {
//
//     var active = (typeof value === "undefined") ? true : value;
//     var index = $scope.isSpreadsheetView() ? 0 : idx;
//
//     // if zero cardinality,  add a new item
//     if (active && $scope.isMultipleCardinality() && $scope.model.length <= 0) {
//       $scope.addMoreInput();
//     }
//
//     // set it active or inactive
//     UIUtilService.setActive($scope.field, index, $scope.path, $scope.uid, active);
//
//     if (schemaService.isDateType($scope.field)) {
//       $scope.setDateValue(index);
//
//       $timeout(function () {
//         $rootScope.$broadcast('runDateValidation');
//       }, 0);
//
//     }
//
//     if (active) {
//
//       $scope.index = index;
//       $scope.pageMinMax();
//
//       // set the parent active index
//       if ($scope.path) {
//         var indices = $scope.path.split('-');
//         var last = indices[indices.length - 1];
//         $scope.$parent.setIndex(parseInt(last));
//       }
//
//       if (!$scope.isSpreadsheetView()) {
//         var zeroedIndex = $scope.isSpreadsheetView() ? 0 : index;
//         var zeroedLocator = $scope.getLocator(zeroedIndex);
//
//         // scroll it into the center of the screen and listen for shift-enter
//         $scope.scrollToLocator(zeroedLocator, ' .select');
//         $document.unbind('keypress');
//         $document.bind('keypress', function (e) {
//           $scope.isSubmit(e, index);
//         });
//         $document.unbind('keyup');
//         $document.bind('keyup', function (e) {
//           $scope.isSubmit(e, index);
//         });
//       }
//     }
//   };
//
//   // scroll within the template to the field with the locator, focus and select the tag
//   scrollToLocator = function (locator, tag) {
//   };
//
//   // submit this edit
//   onSubmit = function (index, next) {
//     var found = false;
//
//     if ($scope.isActive(index)) {
//
//       UIUtilService.setActive($scope.field, index, $scope.path, false);
//
//       // is there a next one to set active (except for checkboxes and multi-choice lists, for which we don't add new array items)
//       if ($scope.isMultipleCardinality() && !schemaService.isMultipleChoiceField($scope.field)) {
//
//         if (typeof(next) == 'undefined') {
//           if (index + 1 < $scope.model.length) {
//             $scope.setActive(index + 1, true);
//             found = true;
//           }
//         } else {
//           if (next < $scope.model.length) {
//             $scope.setActive(next, true);
//             found = true;
//           }
//         }
//       }
//
//       if (!found) {
//         $scope.$parent.activateNextSiblingOf($scope.fieldKey, $scope.parentKey);
//       }
//     }
//   };
//
// // is this a submit?  shift-enter qualifies as a submit for any field
// isSubmit = function (keyEvent, index) {
//     if (keyEvent.type === 'keypress' && keyEvent.which === 13 && keyEvent.ctrlKey) {
//       $scope.onSubmit(index);
//     }
//     // Doesn't work for multi-input fields like attribute-value
//     // if (keyEvent.type === 'keyup' && keyEvent.which === 9) {
//     //   keyEvent.preventDefault();
//     //   $scope.onSubmit(index);
//     // }
//   };
//
// addRow = function () {
//     if ($scope.isSpreadsheetView()) {
//       SpreadsheetService.addRow($scope);
//     } else {
//       $scope.addMoreInput();
//     }
//   };
//
//
//
//
// // an array of attribute names for attribute-value types
// setAttributeValueArray = function () {
//
//     var parentModel = $scope.parentModel || $scope.$parent.model;
//     var parentInstance = $scope.parentInstance;
//     var parent = parentModel[parentInstance] || parentModel;
//
//     if (schemaService.isAttributeValueType($scope.field)) {
//       $scope.attributeValueArray = [];
//       for (var i = 0; i < $scope.valueArray.length; i++) {
//         var attributeName = $scope.valueArray[i]['@value'];
//         $scope.attributeValueArray.push(
//           {'@value': (parent.hasOwnProperty(attributeName) ? parent[attributeName]['@value'] : '')});
//       }
//     }
//   };
//
// // initializes the value @type field if it has not been initialized yet
// initializeValueType = function () {
//     dms.initializeValueType($scope.field, $scope.model);
//   };
//
// // initializes the value field (or fields) to null (either @id or @value) if it has not been initialized yet.
// // It also initializes optionsUI
// initializeValue = function () {
//     if (!$scope.hasBeenInitialized) {
//       // If we are creating a new instance, the model is still completely empty. If there are any default values,
//       // we set them. It's important to do this only if the model is empty to avoid overriding values of existing
//       // instances with default values.
//       // The model is initialized with default options when parsing the form (see form.directive.js).
//       $scope.model = dms.initializeModel($scope.field, $scope.model, false);
//       // If the model has not been initialized yet by setting default values, initialize values
//       dms.initializeValue($scope.field, $scope.model);
//       // Load selected values from the model to the UI, if any
//       $scope.updateUIFromModel();
//     }
//     $scope.hasBeenInitialized = true;
//   };
//
// // uncheck radio buttons
//  uncheck = function (label) {
//     if (schemaService.isRadioType($scope.field)) {
//       if ($scope.optionsUI.radioPreviousOption == label) {
//         // Uncheck
//         $scope.optionsUI.radioOption = null;
//         $scope.optionsUI.radioPreviousOption = null;
//         $scope.updateModelFromUI();
//       }
//       else {
//         $scope.optionsUI.radioPreviousOption = label;
//       }
//     }
//   };
//
//   multiple = {};
//
// // Check the decimal place of the input value
//   var
//   validateDecimals = function (value) {
//     let countDecimals = function (value) {
//       let result = 0;
//       let arr = value.toString().split(".");
//       if (arr.length > 1) {
//         result = arr[1].length;
//       }
//       return result;
//     };
//     let valid = value && schemaService.hasDecimalPlace($scope.field) && (countDecimals(
//       value) <= schemaService.getDecimalPlace(
//       $scope.field));
//     $scope.forms['fieldEditForm' + $scope.index].numericField.$setValidity('decimal', valid);
//   };
//
//   onChange = function () {
//     $scope.valueArray[$scope.index]['@value'] = $scope.data.info[$scope.index].value ? $scope.data.info[$scope.index].value + '' : null;
//   };
//
// // set the instance @value fields based on the options selected at the UI
//   updateModelFromUI = function (newValue, oldValue, isAttributeName) {
//
//     var fieldValue = $scope.getValueLocation();
//     var inputType = $scope.getInputType();
//     var attributeName;
//
//     switch (inputType) {
//       case "numeric":
//         $scope.valueArray[$scope.index]['@value'] = $scope.data.info[$scope.index].value + '';
//         validateDecimals($scope.valueArray[$scope.index]['@value']);
//         break;
//       case "date":
//         var str = $scope.toXSDDate(newValue);
//         if ($scope.model.length > 0) {
//           $scope.model[$scope.index]['@value'] = str;
//         } else {
//           $scope.model['@value'] = str;
//         }
//         break;
//       case 'attribute-value':
//         var parentModel = $scope.parentModel || $scope.$parent.model;
//         var parentInstance = $scope.parentInstance;
//         var parent = parentModel[parentInstance] || parentModel;
//
//         if ($scope.model.length > 0) {
//
//           if (isAttributeName) {
//
//             // attribute name, first make it unique in the parent
//
//             attributeName = $scope.getNewAttributeName(newValue, parent);
//             if (!$scope.isDuplicateAttribute(attributeName, parent)) {
//
//               $scope.valueArray[$scope.index]['@value'] = attributeName;
//
//               if (Array.isArray(parentModel)) {
//                 for (var i = 0; i < parentModel.length; i++) {
//
//                   // update all the instances
//                   parentModel[i][$scope.fieldKey][$scope.index] = attributeName;
//
//                   // update attribute name in the parent
//
//                   parentModel[i][attributeName] = {'@value': null};
//                   if (oldValue && parentModel[i][oldValue]) {
//                     parentModel[i][attributeName]['@value'] = parentModel[i][oldValue]['@value'];
//                     delete parentModel[i][oldValue];
//                   }
//
//                 }
//               } else {
//
//                 // update attribute name in the attribute-value field and in the parent
//                 parentModel[$scope.fieldKey][$scope.index] = attributeName;
//                 parentModel[attributeName] = {'@value': null};
//                 if (oldValue && parentModel[oldValue]) {
//                   delete parentModel[oldValue];
//                 }
//
//                 //update attribute name in attribute-value field
//                 //$scope.model[$scope.index]['@value'] = attributeName;
//
//
//               }
//             }
//           } else {
//
//             // attribute value, update value in parent model
//             var attributeName = $scope.valueArray[$scope.index]['@value'];
//
//             if (attributeName && parent[attributeName]) {
//               parent[attributeName]['@value'] = newValue;
//             } else {
//               console.log('Error: cannot update attribute value', attributeName, parent);
//             }
//           }
//         }
//         break;
//       case 'checkbox':
//         $scope.model = dms.initializeModel($scope.field, $scope.model, true);
//         // Insert the value at the right position in the model. optionsUI is an object, not an array,
//         // so the right order in the model is not ensured.
//         // The following lines ensure that each option is inserted into the right place
//         var orderedOptions = schemaService.getLiterals($scope.field);
//         for (var i = 0; i < orderedOptions.length; i++) {
//           var option = orderedOptions[i].label;
//           if ($scope.optionsUI[option]) {
//             var newValue = {};
//             newValue[fieldValue] = $scope.optionsUI[option];
//             $scope.model.push(newValue);
//           }
//         }
//         // Default value
//         if ($scope.model.length == 0) {
//           dms.initializeValue($scope.field, $scope.model);
//         }
//         break;
//       case 'radio':
//         $scope.model = dms.initializeModel($scope.field, $scope.model, true);
//         $scope.model[fieldValue] = $scope.optionsUI.radioOption;
//         break;
//       case 'list':
//         $scope.model = dms.initializeModel($scope.field, $scope.model, true);
//         // Multiple-choice list
//         if ($scope.isMultipleChoice()) {
//           for (var i = 0; i < $scope.optionsUI.listMultiSelect.length; i++) {
//             $scope.model.push({'@value': $scope.optionsUI.listMultiSelect[i].label});
//           }
//         }
//         // Single-choice list
//         else {
//           $scope.model[fieldValue] = $scope.optionsUI.listSingleSelect.label;
//         }
//         // Remove the empty string created by the "Nothing selected" option (if it exists)
//         dms.removeEmptyStrings($scope.field, $scope.model);
//         // If the model is empty, set default value
//         dms.initializeValue($scope.field, $scope.model);
//         break;
//     }
//   };
//
//
// // set the UI with the values from the model
//   updateUIFromModel = function () {
//     let inputType = $scope.getInputType();
//     switch (inputType) {
//       case "numeric":
//         for (let i = 0; i < $scope.valueArray.length; i++) {
//           let value;
//           if ($scope.valueArray[i]) {
//             value = Number.parseFloat($scope.valueArray[i]['@value']);
//           }
//           $scope.data.info[i] = {'value': value};
//         }
//         break;
//       case "date":
//         $scope.date.dt = new Date($scope.valueArray[$scope.index]['@value']);
//         break;
//       case "checkbox":
//         $scope.optionsUI = {};
//         var valueLocation = $scope.getValueLocation();
//         for (var i = 0; i < $scope.model.length; i++) {
//           var value = $scope.model[i][valueLocation];
//           $scope.optionsUI[value] = value;
//         }
//         break;
//       case "radio":
//         $scope.optionsUI = {};
//         var valueLocation = $scope.getValueLocation();
//         if ($scope.model) {
//           $scope.optionsUI.radioOption = $scope.model[valueLocation];
//         }
//         break;
//       case "list":
//         $scope.optionsUI = {};
//         var valueLocation = $scope.getValueLocation();
//         if ($scope.isMultipleChoice()) {
//           $scope.optionsUI.listMultiSelect = [];
//           for (var i = 0; i < $scope.model.length; i++) {
//             var v = $scope.model[i][valueLocation];
//             if (v) {
//               $scope.optionsUI.listMultiSelect.push({"label": $scope.model[i][valueLocation]});
//             }
//           }
//         } else {
//           // For this field type only one selected option is possible
//           if ($scope.model) {
//             $scope.optionsUI.listSingleSelect = {"label": $scope.model[valueLocation]};
//           }
//         }
//         break;
//     }
//   };
//
// // if the field is empty, delete the @id field. Note that in JSON-LD @id cannot be null.
// // $scope.checkForEmpty = function () {
// //   var location = $scope.getValueLocation();
// //   var obj = $scope.valueArray[$scope.index];
// //   if (!obj[location] || obj[location].length === 0) {
// //     delete obj[location];
// //   }
// // };
//
//   var
//   copyAttributeValueField = function (parentModel, parentInstance) {
//
//     var parentModel = $scope.parentModel || $scope.$parent.model;
//     var parentInstance = $scope.parentInstance;
//     var parent = parentModel[parentInstance] || parentModel;
//
//
//     // there is no attribute name defined, so give it a default name
//     if (!$scope.valueArray[$scope.index]['@value']) {
//       $scope.updateModelFromUI($scope.fieldKey, '', true);
//     }
//
//     // create a unique attribute name for the copy
//     var attributeValue = $scope.attributeValueArray[$scope.index]['@value'];
//     var oldAttributeName = $scope.valueArray[$scope.index]['@value'];
//     var newAttributeName = $scope.getNewAttributeName(oldAttributeName, parent);
//
//     if (!$scope.isDuplicateAttribute(newAttributeName, parent)) {
//
//
//       if (Array.isArray(parentModel)) {
//         for (var i = 0; i < parentModel.length; i++) {
//
//           // create the obj in the attribute-value field
//           parentModel[i][$scope.fieldKey].splice($scope.index + 1, 0, newAttributeName);
//
//           // create the new field at the parent level
//           var valueObject = {};
//           valueObject["@value"] = attributeValue;
//           parentModel[i][newAttributeName] = valueObject;
//
//         }
//       } else {
//
//         // create the obj in the attribute-value field
//         parentModel[$scope.fieldKey].splice($scope.index + 1, 0, newAttributeName);
//
//         // create the new field at the parent level
//         var valueObject = {};
//         valueObject["@value"] = attributeValue;
//         parentModel[newAttributeName] = valueObject;
//
//       }
//
//       // activate the new instance
//       $timeout(function () {
//         $scope.setValueArray();
//         $scope.setAttributeValueArray();
//         $scope.setActive($scope.index + 1, true);
//       }, 100);
//
//
//     }
//   };
//
// // add more instances to a multiple cardinality field if possible by copying the selected instance
//   copyField = function () {
//     let inputType = $scope.getInputType();
//     let valueLocation = $scope.getValueLocation();
//     let maxItems = schemaService.getMaxItems($scope.field);
//
//     if ((!maxItems || $scope.model.length < maxItems)) {
//       switch (inputType) {
//         case "attribute-value":
//           copyAttributeValueField($scope.parentModel, $scope.parentInstance);
//           break;
//         case 'textfield':
//           if (schemaService.hasValueConstraints($scope.field)) {
//             let obj = {
//               '@id': $scope.valueArray[$scope.index]['@id'],
//               'rdfs:label': $scope.valueArray[$scope.index]['rdfs:label'],
//             };
//             $scope.model.splice($scope.index + 1, 0, obj);
//
//           } else {
//             let obj = {};
//             obj[valueLocation] = $scope.valueArray[$scope.index][valueLocation];
//             $scope.model.splice($scope.index + 1, 0, obj);
//           }
//           $timeout($scope.setActive($scope.index + 1, true), 100);
//           break;
//         case 'numeric':
//           let numberObj = {'@value': $scope.valueArray[$scope.index]['@value']};
//           $scope.model.splice($scope.index + 1, 0, numberObj);
//           $scope.data.info.splice($scope.index + 1, 0, {'value': $scope.data.info[$scope.index].value});
//           $timeout($scope.setActive($scope.index + 1, true), 100);
//           break;
//         default :
//           let obj = {};
//           obj[valueLocation] = $scope.valueArray[$scope.index][valueLocation];
//           $scope.model.splice($scope.index + 1, 0, obj);
//           $timeout($scope.setActive($scope.index + 1, true), 100);
//       }
//     }
//   };
//
//   isDuplicateAttribute = function (name, model) {
//     return model.hasOwnProperty(name);
//   };
//
//   getNewAttributeName = function (oldName, model) {
//     if (!oldName || oldName.length == 0 || $scope.isDuplicateAttribute(oldName, model)) {
//
//       var newName = $scope.fieldKey;
//       var offset = $scope.index;
//       var i = offset--;
//       do {
//         i++;
//       } while ($scope.isDuplicateAttribute(newName + i, model) && i < 10000);
//       return newName + i;
//     } else {
//       return oldName;
//     }
//   };
//
// // add more instances to a multiple cardinality field if multiple and not at the max limit
//   addMoreInput = function () {
//     if (schemaService.isAttributeValueType($scope.field)) {
//       var parentModel = $scope.parentModel || $scope.$parent.model;
//       var parentInstance = $scope.parentInstance;
//       var parent = parentModel[parentInstance] || parentModel;
//
//       var attributeName = $scope.getNewAttributeName('', parent);
//       if (!$scope.isDuplicateAttribute(attributeName, parent)) {
//
//         if (Array.isArray(parentModel)) {
//           for (var i = 0; i < parentModel.length; i++) {
//
//             parentModel[i][$scope.fieldKey][$scope.index] = attributeName;
//             parentModel[i][attributeName] = {'@value': null};
//           }
//         } else {
//
//           parentModel[$scope.fieldKey][$scope.index] = attributeName;
//           parentModel[attributeName] = {'@value': null};
//         }
//         $scope.setValueArray();
//         $scope.setAttributeValueArray();
//         $scope.setActive($scope.model.length - 1, true);
//
//       }
//
//     } else {
//       if ($scope.isMultipleCardinality()) {
//         var valueLocation = $scope.getValueLocation();
//         var maxItems = schemaService.getMaxItems($scope.field);
//         if ((!maxItems || $scope.model.length < maxItems)) {
//           // add another instance in the model
//           var obj = {};
//           obj[valueLocation] = dms.getDefaultValue(valueLocation, $scope.field);
//           $scope.model.push(obj);
//
//           // activate the new instance
//           $scope.setActive($scope.model.length - 1, true);
//         }
//       }
//     }
//     $scope.pageMinMax();
//
//   };
//
// // remove the value of field at index
//   removeInput = function (index) {
//
//     var minItems = schemaService.getMinItems($scope.field) || 0;
//     if ($scope.model.length > minItems) {
//
//       // attribute-value pairs propagate and have unique attributes
//       if (schemaService.isAttributeValueType($scope.field)) {
//         var attributeName = $scope.model[index];
//         if (Array.isArray($scope.parentModel)) {
//           for (var i = 0; i < $scope.parentModel.length; i++) {
//
//             // remove the instance and the unique attribute
//             delete $scope.parentModel[i][attributeName];
//             $scope.parentModel[i][$scope.fieldKey].splice(index, 1);
//           }
//         } else {
//           // remove the instance and the unique attribute
//           delete $scope.parentModel[attributeName];
//           $scope.parentModel[$scope.fieldKey].splice(index, 1);
//         }
//         $scope.valueArray.splice(index, 1);
//         $scope.attributeValueArray.splice(index, 1);
//       } else {
//         // remove the instance
//         $scope.model.splice(index, 1);
//       }
//     }
//   };
//
// //
// // watchers
// //
//
//   /**
//    * For templates or elements that contain attribute-value fields, the following function watches the array of
//    * attribute names and generates/removes the corresponding properties in the @context.
//    */
//   $watchCollection(
//
//   'parentModel[fieldKey]'
// ,
//
//   function(newVal, oldVal) {
//     if (schemaService.isAttributeValueType($scope.field)) {
//       if (oldVal != newVal) { // check that the array actually changed to avoid regenerating context properties
//         for (var i = 0; i < oldVal.length; i++) {
//           // if the old string is not in the new array, remove it from the context.
//           if (newVal.indexOf(oldVal[i] == -1) && $scope.parentModel['@context'][oldVal[i]] != null) {
//             delete $scope.parentModel['@context'][oldVal[i]];
//           }
//         }
//         // check for strings that have been added to the array
//         for (var i = 0; i < newVal.length; i++) {
//           // if the new string is not in the old array, add it to the context.
//           if (oldVal.indexOf(newVal[i] == -1) && $scope.parentModel['@context'][newVal[i]] == null) {
//             $scope.parentModel['@context'][newVal[i]] = UrlService.schemaProperties() + "/" + dms.generateGUID();
//           }
//         }
//       }
//     }
//   }
//
// );
//
// // form has been submitted, look for errors
//   $on(
//
//   'submitForm'
// ,
//
//   function(event) {
//
//     var location = dms.getValueLocation($scope.field);
//     var min = schemaService.getMinItems($scope.field) || 0;
//     var valueConstraint = schemaService.getValueConstraints($scope.field);
//     var id = $scope.getId();
//     var title = $scope.getPropertyLabel();
//
//     // If field is required and is empty, emit failed emptyRequiredField event
//     if ($scope.isRequired()) {
//       var allRequiredFieldsAreFilledIn = true;
//       for (let i = 0; i < $scope.valueArray.length; i++) {
//         var value = $scope.valueArray[i];
//         if (!value) {
//           allRequiredFieldsAreFilledIn = false;
//         } else {
//           if (Array.isArray(value)) {
//             for (let j = 0; j < value.length; j++) {
//               if (!value[j][location]) {
//                 allRequiredFieldsAreFilledIn = false;
//               }
//             }
//           } else {
//             if (!value[location]) {
//               allRequiredFieldsAreFilledIn = false;
//             }
//           }
//         }
//       }
//       $scope.$emit('validationError',
//         [allRequiredFieldsAreFilledIn ? 'remove' : 'add', title, id, 'emptyRequiredField']);
//     }
//
//     if ($scope.hasValueConstraint()) {
//       var allValueFieldsAreValid = true;
//
//       angular.forEach($scope.valueArray, function (valueElement, index) {
//         if (angular.isArray(valueElement)) {
//           angular.forEach(valueElement, function (ve, index) {
//             if (!autocompleteService.isValueConformedToConstraint(ve, location, id, valueConstraint, index)) {
//               allValueFieldsAreValid = false;
//             }
//           });
//         } else {
//           if (angular.isObject(valueElement)) {
//             if (!autocompleteService.isValueConformedToConstraint(valueElement, location, id, valueConstraint,
//               index)) {
//               allValueFieldsAreValid = false;
//             }
//           }
//         }
//       });
//       $scope.$emit('validationError', [allValueFieldsAreValid ? 'remove' : 'add', title, id, 'invalidFieldValues']);
//     }
//   }
//
// );
//
// // watch for a request to set this field active
//   $on(
//
//   'setActive'
// ,
//
//   function(event, args) {
//
//     var id = args[0];
//     var index = args[1];
//     var path = args[2];
//     var fieldKey = args[3];
//     var parentKey = args[4];
//     var value = args[5];
//     var uid = args[6];
//
//     if (id === $scope.getId() && path == $scope.path && fieldKey == $scope.fieldKey && parentKey == $scope.parentKey && uid == $scope.uid) {
//       $scope.setActive(index, value);
//     }
//   }
//
// );
//
// // spreadsheet view will use the 0th instance
//   zeroedLocator = function (value) {
//     var result = '';
//     if (value) {
//       var result = value.replace(/-([^-]*)$/, '-0');
//     }
//     return result;
//   };
//
// // watch for changes in the selection for spreadsheet view to get out of spreadsheet mode
//   $watch(
//
//   function() {
//     return (UIUtilService.activeLocator);
//   }
//
// ,
//
//   function(newValue, oldValue) {
//
//     if ($scope.zeroedLocator(newValue) != $scope.zeroedLocator(oldValue) && $scope.getLocator(
//       0) == $scope.zeroedLocator(oldValue) && $scope.isSpreadsheetView()) {
//       $scope.toggleView();
//     }
//   }
//
// );
//
// // make sure there are at least 10 entries in the spreadsheet
//   createExtraRows = function () {
//     var maxItems = schemaService.getMaxItems($scope.field);
//     while (($scope.model.length < 10 || $scope.model.length < maxItems)) {
//       $scope.addMoreInput();
//     }
//   };
//
// // delete extra blank rows
//   deleteExtraRows = function () {
//     var location = dms.getValueLocation($scope.field);
//     var min = schemaService.getMinItems($scope.field) || 0;
//     if (angular.isArray($scope.model)) {
//
//       loop:for (var i = $scope.model.length; i > min; i--) {
//         var valueElement = $scope.model[i - 1];
//         if (valueElement[location] == null || valueElement[location].length === 0) {
//           $scope.removeInput(i - 1);
//         } else {
//           break loop;
//         }
//       }
//     }
//   };
//
//   isHidden = function () {
//     return schemaService.isHidden($scope.field);
//   };
//
//   hasModel = function () {
//     return $scope.model && $scope.model.length > 0;
//   };
//
// //
// // date picker  date parser
// //
//
//   date = {
//     dt: '',
//     language: navigator.language,
//     format: CONST.dateFormats[navigator.language] || 'dd/MM/yyyy',
//     opened: false,
//     altInputFormats: ['MM/dd/yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd']
//   };
//
// // always store the xsd:date format
//  toXSDDate = function (value) {
//     if ($scope.isInvalidDate(value)) {
//       return null;
//     } else {
//       return $filter('date')(new Date(value), 'yyyy-MM-dd');
//     }
//   };
//
//   setDateValue = function (index) {
//     if ($scope.valueArray && $scope.valueArray[index] && $scope.valueArray[index]['@value']) {
//       var date = new Date($scope.valueArray[index]['@value']);
//       var utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(),
//         date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
//       $scope.date.dt = utcDate;
//
//     } else {
//       $scope.date.dt = null;
//     }
//
//   };
//
//   dateFormat = function (value) {
//     if (value) {
//       var date = new Date(value);
//       date.setMinutes(date.getTimezoneOffset());
//       return date.toLocaleDateString(navigator.language);
//     }
//   };
//
//
//   isInvalidDate = function (value) {
//     var date = uibDateParser.parse(value);
//     return date == null;
//   };


}
