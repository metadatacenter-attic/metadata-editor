import {Injectable} from '@angular/core';
import {FieldTypeService} from './field-type.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  const: object;
  fieldType: object;


  constructor(private fieldTypeService: FieldTypeService) {
    this.const = {
      "resourceType": {
        "TEMPLATE": "template",
        "FIELD": "field",
        "ELEMENT": "element",
        "INSTANCE": "instance",
        "LINK": "link",
        "FOLDER": "folder",
        "METADATA": "metadata",
      },
      "resourceId": {
        "ELEMENT": "https://schema.metadatacenter.org/core/TemplateElement"
      },
      "publication": {
        "VERSION": "pav:version",
        "STATUS": "bibo:status",
        "DRAFT": "bibo:draft",
        "PUBLISHED": "bibo:published",
        "ALL": "all",
        "LATEST": "latest-by-status"
      },
      "model": {
        "NAME": "schema:name",
        "DESCRIPTION": "schema:description",
        "IDENTIFIER": "schema:identifier",
        "ISBASEDON": "schema:isBasedOn",
        "NUMBEROFINSTANCES": 'numberOfInstances',
        "DERIVEDFROM": "derivedFrom",
        "PREFLABEL": "skos:prefLabel",
        "CONSTRAINEDTERMID": 'termUri',
        "CONSTRAINEDID": '@id',
        "CONSTRAINEDLABEL": 'rdfs:label',
        "CONSTRAINEDNOTATION": 'skos:notation',
        "NOTATION": 'notation'
      },
      "dateFormats": {
        "ar-SA": "dd/MM/yy",
        "bg-BG": "dd.M.yyyy",
        "ca-ES": "dd/MM/yyyy",
        "zh-TW": "yyyy/M/d",
        "cs-CZ": "d.M.yyyy",
        "da-DK": "dd-MM-yyyy",
        "de-DE": "dd.MM.yyyy",
        "el-GR": "d/M/yyyy",
        "en-US": "M/d/yyyy",
        "fi-FI": "d.M.yyyy",
        "fr-FR": "dd/MM/yyyy",
        "he-IL": "dd/MM/yyyy",
        "hu-HU": "yyyy. MM. dd.",
        "is-IS": "d.M.yyyy",
        "it-IT": "dd/MM/yyyy",
        "ja-JP": "yyyy/MM/dd",
        "ko-KR": "yyyy-MM-dd",
        "nl-NL": "d-M-yyyy",
        "nb-NO": "dd.MM.yyyy",
        "pl-PL": "yyyy-MM-dd",
        "pt-BR": "d/M/yyyy",
        "ro-RO": "dd.MM.yyyy",
        "ru-RU": "dd.MM.yyyy",
        "hr-HR": "d.M.yyyy",
        "sk-SK": "d. M. yyyy",
        "sq-AL": "yyyy-MM-dd",
        "sv-SE": "yyyy-MM-dd",
        "th-TH": "d/M/yyyy",
        "tr-TR": "dd.MM.yyyy",
        "ur-PK": "dd/MM/yyyy",
        "id-ID": "dd/MM/yyyy",
        "uk-UA": "dd.MM.yyyy",
        "be-BY": "dd.MM.yyyy",
        "sl-SI": "d.M.yyyy",
        "et-EE": "d.MM.yyyy",
        "lv-LV": "yyyy.MM.dd.",
        "lt-LT": "yyyy.MM.dd",
        "fa-IR": "MM/dd/yyyy",
        "vi-VN": "dd/MM/yyyy",
        "hy-AM": "dd.MM.yyyy",
        "az-Latn-AZ": "dd.MM.yyyy",
        "eu-ES": "yyyy/MM/dd",
        "mk-MK": "dd.MM.yyyy",
        "af-ZA": "yyyy/MM/dd",
        "ka-GE": "dd.MM.yyyy",
        "fo-FO": "dd-MM-yyyy",
        "hi-IN": "dd-MM-yyyy",
        "ms-MY": "dd/MM/yyyy",
        "kk-KZ": "dd.MM.yyyy",
        "ky-KG": "dd.MM.yy",
        "sw-KE": "M/d/yyyy",
        "uz-Latn-UZ": "dd/MM yyyy",
        "tt-RU": "dd.MM.yyyy",
        "pa-IN": "dd-MM-yy",
        "gu-IN": "dd-MM-yy",
        "ta-IN": "dd-MM-yyyy",
        "te-IN": "dd-MM-yy",
        "kn-IN": "dd-MM-yy",
        "mr-IN": "dd-MM-yyyy",
        "sa-IN": "dd-MM-yyyy",
        "mn-MN": "yy.MM.dd",
        "gl-ES": "dd/MM/yy",
        "kok-IN": "dd-MM-yyyy",
        "syr-SY": "dd/MM/yyyy",
        "dv-MV": "dd/MM/yy",
        "ar-IQ": "dd/MM/yyyy",
        "zh-CN": "yyyy/M/d",
        "de-CH": "dd.MM.yyyy",
        "en-GB": "dd/MM/yyyy",
        "es-MX": "dd/MM/yyyy",
        "fr-BE": "d/MM/yyyy",
        "it-CH": "dd.MM.yyyy",
        "nl-BE": "d/MM/yyyy",
        "nn-NO": "dd.MM.yyyy",
        "pt-PT": "dd-MM-yyyy",
        "sr-Latn-CS": "d.M.yyyy",
        "sv-FI": "d.M.yyyy",
        "az-Cyrl-AZ": "dd.MM.yyyy",
        "ms-BN": "dd/MM/yyyy",
        "uz-Cyrl-UZ": "dd.MM.yyyy",
        "ar-EG": "dd/MM/yyyy",
        "zh-HK": "d/M/yyyy",
        "de-AT": "dd.MM.yyyy",
        "en-AU": "d/MM/yyyy",
        "es-ES": "dd/MM/yyyy",
        "fr-CA": "yyyy-MM-dd",
        "sr-Cyrl-CS": "d.M.yyyy",
        "ar-LY": "dd/MM/yyyy",
        "zh-SG": "d/M/yyyy",
        "de-LU": "dd.MM.yyyy",
        "en-CA": "dd/MM/yyyy",
        "es-GT": "dd/MM/yyyy",
        "fr-CH": "dd.MM.yyyy",
        "ar-DZ": "dd-MM-yyyy",
        "zh-MO": "d/M/yyyy",
        "de-LI": "dd.MM.yyyy",
        "en-NZ": "d/MM/yyyy",
        "es-CR": "dd/MM/yyyy",
        "fr-LU": "dd/MM/yyyy",
        "ar-MA": "dd-MM-yyyy",
        "en-IE": "dd/MM/yyyy",
        "es-PA": "MM/dd/yyyy",
        "fr-MC": "dd/MM/yyyy",
        "ar-TN": "dd-MM-yyyy",
        "en-ZA": "yyyy/MM/dd",
        "es-DO": "dd/MM/yyyy",
        "ar-OM": "dd/MM/yyyy",
        "en-JM": "dd/MM/yyyy",
        "es-VE": "dd/MM/yyyy",
        "ar-YE": "dd/MM/yyyy",
        "en-029": "MM/dd/yyyy",
        "es-CO": "dd/MM/yyyy",
        "ar-SY": "dd/MM/yyyy",
        "en-BZ": "dd/MM/yyyy",
        "es-PE": "dd/MM/yyyy",
        "ar-JO": "dd/MM/yyyy",
        "en-TT": "dd/MM/yyyy",
        "es-AR": "dd/MM/yyyy",
        "ar-LB": "dd/MM/yyyy",
        "en-ZW": "M/d/yyyy",
        "es-EC": "dd/MM/yyyy",
        "ar-KW": "dd/MM/yyyy",
        "en-PH": "M/d/yyyy",
        "es-CL": "dd-MM-yyyy",
        "ar-AE": "dd/MM/yyyy",
        "es-UY": "dd/MM/yyyy",
        "ar-BH": "dd/MM/yyyy",
        "es-PY": "dd/MM/yyyy",
        "ar-QA": "dd/MM/yyyy",
        "es-BO": "dd/MM/yyyy",
        "es-SV": "dd/MM/yyyy",
        "es-HN": "dd/MM/yyyy",
        "es-NI": "dd/MM/yyyy",
        "es-PR": "dd/MM/yyyy",
        "am-ET": "d/M/yyyy",
        "tzm-Latn-DZ": "dd-MM-yyyy",
        "iu-Latn-CA": "d/MM/yyyy",
        "sma-NO": "dd.MM.yyyy",
        "mn-Mong-CN": "yyyy/M/d",
        "gd-GB": "dd/MM/yyyy",
        "en-MY": "d/M/yyyy",
        "prs-AF": "dd/MM/yy",
        "bn-BD": "dd-MM-yy",
        "wo-SN": "dd/MM/yyyy",
        "rw-RW": "M/d/yyyy",
        "qut-GT": "dd/MM/yyyy",
        "sah-RU": "MM.dd.yyyy",
        "gsw-FR": "dd/MM/yyyy",
        "co-FR": "dd/MM/yyyy",
        "oc-FR": "dd/MM/yyyy",
        "mi-NZ": "dd/MM/yyyy",
        "ga-IE": "dd/MM/yyyy",
        "se-SE": "yyyy-MM-dd",
        "br-FR": "dd/MM/yyyy",
        "smn-FI": "d.M.yyyy",
        "moh-CA": "M/d/yyyy",
        "arn-CL": "dd-MM-yyyy",
        "ii-CN": "yyyy/M/d",
        "dsb-DE": "d. M. yyyy",
        "ig-NG": "d/M/yyyy",
        "kl-GL": "dd-MM-yyyy",
        "lb-LU": "dd/MM/yyyy",
        "ba-RU": "dd.MM.yy",
        "nso-ZA": "yyyy/MM/dd",
        "quz-BO": "dd/MM/yyyy",
        "yo-NG": "d/M/yyyy",
        "ha-Latn-NG": "d/M/yyyy",
        "fil-PH": "M/d/yyyy",
        "ps-AF": "dd/MM/yy",
        "fy-NL": "d-M-yyyy",
        "ne-NP": "M/d/yyyy",
        "se-NO": "dd.MM.yyyy",
        "iu-Cans-CA": "d/M/yyyy",
        "sr-Latn-RS": "d.M.yyyy",
        "si-LK": "yyyy-MM-dd",
        "sr-Cyrl-RS": "d.M.yyyy",
        "lo-LA": "dd/MM/yyyy",
        "km-KH": "yyyy-MM-dd",
        "cy-GB": "dd/MM/yyyy",
        "bo-CN": "yyyy/M/d",
        "sms-FI": "d.M.yyyy",
        "as-IN": "dd-MM-yyyy",
        "ml-IN": "dd-MM-yy",
        "en-IN": "dd-MM-yyyy",
        "or-IN": "dd-MM-yy",
        "bn-IN": "dd-MM-yy",
        "tk-TM": "dd.MM.yy",
        "bs-Latn-BA": "d.M.yyyy",
        "mt-MT": "dd/MM/yyyy",
        "sr-Cyrl-ME": "d.M.yyyy",
        "se-FI": "d.M.yyyy",
        "zu-ZA": "yyyy/MM/dd",
        "xh-ZA": "yyyy/MM/dd",
        "tn-ZA": "yyyy/MM/dd",
        "hsb-DE": "d. M. yyyy",
        "bs-Cyrl-BA": "d.M.yyyy",
        "tg-Cyrl-TJ": "dd.MM.yy",
        "sr-Latn-BA": "d.M.yyyy",
        "smj-NO": "dd.MM.yyyy",
        "rm-CH": "dd/MM/yyyy",
        "smj-SE": "yyyy-MM-dd",
        "quz-EC": "dd/MM/yyyy",
        "quz-PE": "dd/MM/yyyy",
        "hr-BA": "d.M.yyyy.",
        "sr-Latn-ME": "d.M.yyyy",
        "sma-SE": "yyyy-MM-dd",
        "en-SG": "d/M/yyyy",
        "ug-CN": "yyyy-M-d",
        "sr-Cyrl-BA": "d.M.yyyy",
        "es-US": "M/d/yyyy"
      }
    };
    this.fieldTypeService = fieldTypeService;

  }


  schemaOf(node) {
    if (node) {
      if (node['type'] == 'array' && node['items']) {
        return node['items'];
      } else {
        return node;
      }
    }
  };

  propertiesOf(node) {
    if (node) {
      return this.schemaOf(node)['properties'];
    }
  };

  typeOf(node) {
    if (node) {
      return this.schemaOf(node)['@type'];
    }
  };

  getId(node) {
    return this.schemaOf(node)['@id'];
  };

  isElement(node) {
    return this.typeOf(node) == this.const['resourceId']['ELEMENT'];
  }

  isCardinalElement(node) {
    return node.type == 'array';
  };

  // is this a checkbox, radio or list question?
  isMultiAnswer(node) {
    return this.isCheckboxListRadioType(this.getInputType(node));
  };

  isCheckboxListRadioType(inputType) {
    return ((inputType == 'checkbox') || (inputType == 'radio') || (inputType == 'list'));
  };

  isRootNode(parent, child) {
    return parent && child && this.getId(child) == this.getId(parent);
  };

  getStatus(node) {
    if (this.schemaOf(node)) {
      return this.schemaOf(node)['bibo:status'];
    }
  };

  getVersion(node) {
    if (this.schemaOf(node)) {
      return this.schemaOf(node)['pav:version'];
    }
  };

  getTitle(node) {
    if (this.schemaOf(node)) {
      return this.schemaOf(node)['schema:name'];
    }
  };

  getPreferredLabel(node) {
    if (node) {
      return this.schemaOf(node)['skos:prefLabel'];
    }
  };

  getLabel = function (node, parent, key) {
    return this.getPreferredLabel(node) || this.getPropertyLabel(parent, key) || this.getTitle(node);
  };

  getHelp = function (node) {
    return this.getPropertyDescription(node) || this.getDescription(node);
  };

  getInputType(node) {
    if (node) {
      let result = null;
      let schema = this.schemaOf(node);
      if (schema && schema['_ui'] && schema['_ui']['inputType']) {
        result = schema['_ui']['inputType'];
      }
      return result;
    }
  };

  isStaticType(node) {
    if (node) {
      return this.fieldTypeService.isStaticField(this.getInputType(node));
    }
  };

  getUnescapedContent = function (node) {
    return node._ui._content;
  };

  // is this a radio, or a sigle-choice ?
  isSingleChoiceListField(node) {
    let inputType = this.getInputType(node);
    return ((inputType == 'radio') || ((inputType == 'list') && !this.isMultipleChoice(node)));
  };

  isAttributeValueType(node) {
    return (this.getInputType(node) == 'attribute-value');
  };

  isTextFieldType(node) {
    return (node && this.getInputType(node) == 'textfield');
  };

  isDateType(node) {
    return (this.getInputType(node) == 'date');
  };

  isLinkType(node) {
    return (this.getInputType(node) == 'link');
  };

  isCheckboxType(node) {
    return (this.getInputType(node) == 'checkbox');
  };

  isRadioType(node) {
    return (this.getInputType(node) == 'radio');
  };

  isListType(node) {
    return (this.getInputType(node) == 'list');
  };

  // is this a numeric field?
  isNumericType(node) {
    return (this.getInputType(node) == 'numeric');
  };

  getDecimalPlace = function (node) {
    return this.schemaOf(node)['_valueConstraints']['decimalPlace'];
  };

  getNumberType = function (node) {
    return  this.schemaOf(node)['_valueConstraints']['numberType'];
  };

  /* is this a multiple choice list? */
  isMultipleChoice(node) {
    if (this.schemaOf(node)._valueConstraints) {
      return this.schemaOf(node)._valueConstraints.multipleChoice;
    }
    else if (this.schemaOf(node).items && this.schemaOf(node)._valueConstraints) {
      return this.schemaOf(node).items._valueConstraints.multipleChoice;
    }
  };

  /* is this a checkbox, or a multiple choice list field? */
  isMultipleChoiceField(node) {
    return ((this.getInputType(node) == 'checkbox') || (this.isMultipleChoice(node)));
  };

  /* get the propertyLabel out of this node */
  getPropertyLabels(node) {
    if (node) {
      return this.schemaOf(node)['_ui']['propertyLabels'];
    }
  };

  getPropertyLabel(parent, key) {
    return this.getPropertyLabels(parent)[key];
  };

  getPropertyDescriptions(node) {
    if (node) {
      return this.schemaOf(node)['_ui']['propertyDescriptions'];
    }
  };

  hasVersion(node) {
    return this.schemaOf(node).hasOwnProperty('pav:version');
  };

  isSpecialKey(key) {
    let specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^rdfs:)|(^oslc:)/i;
    return specialKeyPattern.test(key);
  };

  // Function that generates the @context for an instance, based on the schema @context definition
  generateInstanceContext(schemaContext) {
    console.log('generateinstanceContext',schemaContext);
    let context = {};
    let properties = this.propertiesOf(schemaContext);

    Object.keys(properties).forEach(function(key) {

      let value = properties[key];
      if (value.type == "object") {
        context[key] = {};
        let valueProperties = value['properties'];
        Object.keys(valueProperties).forEach(function(key2) {
          let value2 = valueProperties[key2];
          if (value2.enum) {
            context[key][key2] = value2.enum[0];
          }
        });
      }
      else {
        if (value.enum) {
          context[key] = value.enum[0];
        }
      }
    });
    return context;
  };

  // TODO Function that generates the @type for a field in an instance, based on the schema @type definition
  generateInstanceType(schemaType) {

    let instanceType = null;
    let enumeration: any;
    enumeration = {};
    if (!schemaType.oneOf) {
      enumeration = schemaType.enum;

    }
    else {
      enumeration = schemaType.oneOf[0].enum;
    }
    // If the type is defined at the schema level
    if (enumeration) {
      // If only one type has been defined, it is returned
      if (enumeration.length == 1) {
        instanceType = enumeration[0];
        // If more than one type have been defined for the template/element/field, an array is returned
      } else {
        instanceType = enumeration;
      }
    }
    return instanceType;
  };

  paginate(form) {
    if (form) {

      let orderArray = [];
      let titles = [];
      let dimension = 0;

      form._ui.order.forEach((field, index) => {

        // If item added is of type Page Break, jump into next page array for storage of following fields
        if (form.properties[field] && form.properties[field]._ui &&
          form.properties[field]._ui.inputType == 'page-break') {
          if (index == 0) {
            titles.push(this.getTitle(form));
          } else {
            dimension++;
            titles.push(this.getTitle(form.properties[field]));
          }
        }
        // Push field key into page array
        orderArray[dimension] = orderArray[dimension] || [];
        orderArray[dimension].push(field);
      });

      if (titles.length == 0) {
        titles.push(this.getTitle(form));
      }

      return {
        order: orderArray,
        title: titles
      };
    }

  };

  hasUserDefinedDefaultValue = function (field) {
    var schema = this.schemaOf(field);
    if (schema._valueConstraints && schema._valueConstraints.defaultValue ) {
      return true;
    }
    else {
      return false;
    }
  };

  getUserDefinedDefaultValue = function (field) {
    if (this.hasUserDefinedDefaultValue(field)) {
      return this.schemaOf(field)._valueConstraints.defaultValue;
    }
    else {
      return null;
    }
  };

  getDefaultValue = function (fieldValue, field) {
    console.log('getDefaultValue',field, this);
    if (fieldValue == "@value") {
      // If the template contains a user-defined default value, we use it as the default value for the field
      if (this.isTextFieldType(field) && this.hasUserDefinedDefaultValue(field)) {
        return this.getUserDefinedDefaultValue(field);
      }
      if (this.isAttributeValueType(field)) {
        return this.getTitle(field);
      }
      // Otherwise, we return the default value, which is 'null'
      else {
        return null;
      }
    }
    // Otherwise don't return anything because the @id field can't be initialized to null
  };

  // This function initializes the @value field (in the model) to null if it has not been initialized yet.
  // For text fields, it may also set it to a default value set by the user when creating the template. Note that
  // the @id field can't be initialized to null. In JSON-LD, @id must be a string, so we don't initialize it.
  initializeValue(field, model) {



    if (this.isAttributeValueType(field)) {
    } else {
      let fieldValue = this.getValueLocation(field);
      if (fieldValue == "@value") {

        let defaultValue = this.getDefaultValue(fieldValue, field);

        // Not an array
        if (!Array.isArray(model)) {
          if (!model) {
            model = {};
          }
          // Value field has been defined
          if (model.hasOwnProperty(fieldValue)) {
            // If undefined value or empty string
            if (!model[fieldValue] || ((model[fieldValue]) && (model[fieldValue].length == 0))) {
              model[fieldValue] = defaultValue;
            }
          }
          // Value field has not been defined
          else {
            model[fieldValue] = defaultValue;
          }
        }
        // An array
        else {
          // Length is 0
          if (model.length == 0) {
            model.push({});
            model[0][fieldValue] = defaultValue;
          }
          // If length > 0
          else {
            for (let i = 0; i < model.length; i++) {
              this.initializeValue(field, model[i]);
            }
          }
        }
      }
    }

  };

  /* Initializes the value @type field in the model based on the fieldType.
   Note that for 'date' and 'numeric' fields, the field schema is flexible, allowing any string as a type.
   Users may want to manually create instances that use different date or numeric types (e.g., xsd:integer).
   As a consequence, we cannot use the @type definition from the schema to generate the @type for the instance
   field. We 'manually' generate those types. */
  initializeValueType = function (field, model) {
    let fieldType;
    if (this.isNumericType(field)) {
      fieldType = this.generateInstanceTypeForNumericField(field);
    }
    else if (this.isDateType(field)) {
      fieldType = this.generateInstanceTypeForDateField();
    }
    else {
      let properties = this.propertiesOf(field);
      if (properties && !properties.hasOwnProperty('@type') || !properties['@type']) {
        fieldType = this.generateInstanceType(properties['@type']);
      }
    }
    if (fieldType) {
      // It is not an array
      if (field.type == 'object') {
        // If the @type has not been defined yet, define it
        if (model && !model.hasOwnProperty('@type') || !model['@type']) {
          // No need to set the type if it is xsd:string. It is the type by default
          if (fieldType != "xsd:string") {
            model['@type'] = fieldType;
          }
        }
      }
      // It is an array
      else if (field.type == 'array') {
        for (var i = 0; i < model.length; i++) {
          // If there is an item in the array for which the @type has not been defined, define it
          if (model[i] && !model[i].hasOwnProperty('@type') || !model[i]['@type']) {
            // No need to set the type if it is xsd:string. It is the type by default
            if (fieldType != "xsd:string") {
              model[i]['@type'] = fieldType;
            }
          }
        }
      }
    }

  };

  // get the value constraint literal values
  getLiterals(node) {
    let valueConstraints = this.schemaOf(node)._valueConstraints;
    if (valueConstraints) {
      return valueConstraints.literals;
    }
  };

  // does this field have a value constraint?
  hasValueConstraint(node) {
    let result = false;

    let vcst = this.schemaOf(node)._valueConstraints;
    if (vcst) {
      let hasOntologies = vcst.ontologies && vcst.ontologies.length > 0;
      let hasValueSets = vcst.valueSets && vcst.valueSets.length > 0;
      let hasClasses = vcst.classes && vcst.classes.length > 0;
      let hasBranches = vcst.branches && vcst.branches.length > 0;
      result = hasOntologies || hasValueSets || hasClasses || hasBranches;
    }

    return result;
  };

  // get the controlled terms list for field types
  getFieldControlledTerms(node) {
    if (this.isStaticType(node) || this.isAttributeValueType(node)) { // static or attribute value fields
      return null;
    }
    else { // regular fields
      let properties = this.propertiesOf(node);
      if (properties['@type'] && properties['@type'].oneOf && properties['@type'].oneOf[1]) {
        return properties['@type'].oneOf[1].items['enum'];
      }
      else {
        return null;
      }
    }
  };

  // where is the value of this field, @id or @value?
  getValueLocation(field) {
    // usually it is in  @value
    let fieldValue = "@value";
    // but these three put it @id
    if (this.getFieldControlledTerms(field) || this.hasValueConstraint(field) || this.isLinkType(field)) {
      fieldValue = "@id";
    }
    return fieldValue;
  };

  /* Sets the default selections for multi-answer fields in instance model */
  defaultOptionsToModel = function (field, model) {
    if (this.isMultiAnswer(field)) {
      let literals = this.getLiterals(field);
      let fieldValue = this.getValueLocation(field);
      // Checkbox or multi-choice  list
      if (this.isMultipleChoiceField(field)) {
        for (var i = 0; i < literals.length; i++) {
          if (literals[i].selectedByDefault) {
            var newValue = {};
            newValue[fieldValue] = literals[i].label;
            model.push(newValue);
          }
        }
      }
      // Radio or single-choice list
      else if (this.isSingleChoiceListField(field)) {
        for (let i = 0; i < literals.length; i++) {
          if (literals[i].selectedByDefault) {
            model[fieldValue] = literals[i].label;
            break;
          }
        }
      }
    }
  };

  /*  use the form properties to create the instance model */
  parseForm(properties, parentModel) {



    for (let name in properties) {
      if (properties.hasOwnProperty(name)) {

        let value = properties[name];

        // Add @context information to instance
        if (name == '@context') {
          parentModel['@context'] = this.generateInstanceContext(value);
        }
        // Add @type information to template/element instance
        else if (name == '@type') {
          var type = this.generateInstanceType(value);
          if (type) {
            parentModel['@type'] = type;
          }
        }

        if (!this.isSpecialKey(name)) {
          if (this.typeOf(value) == this.const['resourceId']['ELEMENT']) {
            // Template Element
            var min = value.minItems || 0;

            // Handle position and nesting within $scope.model if it does not exist
            if (!this.isCardinalElement(value)) {
              parentModel[name] = {};
            } else {
              parentModel[name] = [];
              for (var i = 0; i < min; i++) {
                parentModel[name].push({});
              }
            }

            if (Array.isArray(parentModel[name])) {
              for (var i = 0; i < min; i++) {
                // Indication of nested element or nested fields reached, recursively call function
                this.parseForm(this.propertiesOf(value), parentModel[name][i]);
              }
            } else {
              this.parseForm(this.propertiesOf(value), parentModel[name]);
            }


          } else {
            // Template Field
            if (!this.isStaticType(value)) {
              // Not a Static Field
              var min = value.minItems || 0;

              // Assign empty field instance model to $scope.model only if it does not exist
              if (parentModel[name] == undefined) {
                // Not multiple instance
                if (!this.isCardinalElement(value)) {
                  // Multiple choice fields (checkbox and multi-choice list) store an array of values
                  if (this.isMultipleChoiceField(value)) {
                    parentModel[name] = [];
                  }
                  // All other fields, including the radio field and the list field with single option
                  else {
                    parentModel[name] = {};
                  }
                  // Multiple instance
                } else {
                  parentModel[name] = [];
                  for (var i = 0; i < min; i++) {
                    var obj = {};
                    parentModel[name].push(obj);
                  }
                }
                // Set default values and types for fields
                this.initializeValue(value, parentModel[name]);
                // Initialize value type for those fields that have it
                if (this.isTextFieldType(value) || this.isDateType(value) || this.isNumericType(value)) {
                  this.initializeValueType(value, parentModel[name]);
                }
                if (this.isAttributeValueType(value)) {
                  // remove the @context entry for this attribute-value field
                  // delete the context in the parent
                  if (parentModel) {
                    if (parentModel['@context']) {
                      delete parentModel['@context'][name];
                    }
                    parentModel[name] = [];
                  }
                }
                this.defaultOptionsToModel(value, parentModel[name]);
              }
            }
          }
        }
      }
    }
  };

  /* Rename an array item */
  renameItemInArray(array, name, newName) {
    let index = array.indexOf(name);
    if (index > -1) {
      array[index] = newName;
    }
    return array;
  };

  /* remove the _tmp field from the node and its properties */
  stripTmpIfPresent(node) {

    if (node.hasOwnProperty("_tmp")) {
      delete node['_tmp'];
    }

    let schema = this.schemaOf(node);
    if (schema && schema.hasOwnProperty("_tmp")) {
      delete schema['_tmp'];
    }
  };

  /* deep strip out the _tmp properties */
  stripTmps(node) {
    if (typeof(node) == "object") {

      this.stripTmpIfPresent(node);

      if (node['type'] == 'array') {
        node = node['items'];
      }

      for (let key of Object.keys(node))  {
        if (!this.isSpecialKey(key)) {
          this.stripTmps(node[key]);
        }
      }
    }
  };

  getAcceptableKey(obj, suggestedKey, currentKey) {

    if (!obj || typeof(obj) != "object") {
      return;
    }

    if (currentKey == suggestedKey) {
      return currentKey;
    }

    let key = suggestedKey;

    if (obj[key]) { // if the object already contains the suggested key, generate an acceptable key
      let idx = 1;
      let newKey = "" + key + idx;
      while (obj[newKey]) {
        if (currentKey == newKey) {
          break; // currentKey is an acceptable key
        }
        idx += 1;
        newKey = "" + key + idx;
      }
      key = newKey;
    }

    return key;
  };

  renameKeyOfObject(obj, currentKey, newKey) {
    if (!obj || !obj[currentKey]) {
      return;
    }

    let key = this.getAcceptableKey(obj, newKey, currentKey);
    Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(obj, currentKey));
    delete obj[currentKey];

    return obj;
  };

  /* update the key values to reflect the property or name. this does not look at nested fields and elements, just top level */
  updateKeys(parent) {
    let properties = this.propertiesOf(parent);
    for (let key of properties.keys()) {
      if (!this.isSpecialKey(key)) {
        this.updateKey(key, properties[key], parent);
      }
    }
  };

  updateKey(key, node, parent) {
    if (!this.isRootNode(parent, node) && !this.hasVersion(node)) {
      let title = this.getTitle(node);
      let labels = this.getPropertyLabels(parent);
      let label = labels && labels[key];
      let descriptions = this.getPropertyDescriptions(parent);
      let description = descriptions && descriptions[key];
      this.relabel(parent, key, title, label, description);
    }
  };

  /* Relabel the element key with a new value from the propertyLabels */
  relabel(parent, key, title, label, description) {

    /* Relabel the field key with the field title */
    let relabelField = function(schema, key, newKey, label, description) {
      if (!label) {
        console.log('Error: relabelField missing label');
      }
      if (key != newKey) {

        // get the new key
        let properties = this.propertiesOf(schema);
        this.renameKeyOfObject(properties, key, newKey);

        // Rename the key in the @context
        if (properties["@context"] && properties["@context"].properties) {
          this.renameKeyOfObject(properties["@context"].properties, key, newKey);
        }
        if (properties["@context"] && properties["@context"].required) {
          var idx = properties["@context"].required.indexOf(key);
          properties["@context"].required[idx] = newKey;
        }

        // Rename the key in the 'order' array
        if (schema._ui.order) {
          schema._ui.order = this.renameItemInArray(schema._ui.order, key, newKey);
        }

        // Rename key in the 'required' array
        if (schema.required) {
          schema.required = this.renameItemInArray(schema.required, key, newKey);
        }

        // Rename key in the 'propertyLabels' array
        if (schema['_ui']['propertyLabels']) {
          delete schema['_ui']['propertyLabels'][key];
          schema['_ui']['propertyLabels'][newKey] = label;
        }

        // Rename key in the 'propertyDescriptions' array
        if (schema['_ui']['propertyDescriptions']) {
          delete schema['_ui']['propertyDescriptions'][key];
          schema['_ui']['propertyDescriptions'][newKey] = description;
        }
      }
    };

    if (key != title) {
      let schema = this.schemaOf(parent);
      let properties = this.propertiesOf(parent);
      let newKey = this.getAcceptableKey(properties, label, key);

      for (let k of properties.keys()) {

        if (properties[k] && key == k) {
          relabelField(schema, key, newKey, label, description);
        }
      }
    }
  };

}
