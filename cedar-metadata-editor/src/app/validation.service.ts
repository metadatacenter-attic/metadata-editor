import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validationTypes: object;
  resourceType: object;
  data: object;

  constructor() {
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

  dms = {
    schemaOf(node) {
      if (node) {
        if (node.type == 'array' && node.items) {
          return node.items;
        } else {
          return node;
        }
      }
    },

    propertiesOf(node) {
      if (node) {
        return this.schemaOf(node).properties;
      }
    },

    getId(node) {
      return this.schemaOf(node)['@id'];
    },

    isRootNode(parent, child) {
      return parent && child && this.getId(child) == this.getId(parent);
    },

    /* get the propertyLabel out of this node */
    getPropertyLabels(node) {
      if (node) {
        return this.schemaOf(node)['_ui']['propertyLabels'];
      }
    },

    // get the propertyLabel out of this node
    getPropertyDescriptions(node) {
      if (node) {
        return this.schemaOf(node)['_ui']['propertyDescriptions'];
      }
    },

    hasVersion(node) {
      return this.schemaOf(node).hasOwnProperty('pav:version');
    },

    isSpecialKey(key) {
      let specialKeyPattern = /(^@)|(^_)|(^schema:)|(^pav:)|(^rdfs:)|(^oslc:)/i;
      return specialKeyPattern.test(key);
    },

    /* Rename an array item */
    renameItemInArray(array, name, newName) {
      var index = array.indexOf(name);
      if (index > -1) {
        array[index] = newName;
      }
      return array;
    },

    /* remove the _tmp field from the node and its properties */
    stripTmpIfPresent(node) {

      if (node.hasOwnProperty("_tmp")) {
        delete node._tmp;
      }

      let schema = this.data.schemaOf(node);
      if (schema && schema.hasOwnProperty("_tmp")) {
        delete schema._tmp;
      }
    },

    stripTmps(node) {
      this.stripTmpIfPresent(node);

      if (node.type == 'array') {
        node = node.items;
      }

      for (let key of node.keys()) {
        if (!this.isSpecialKey(key)) {
          this.stripTmps(node[key]);
        }
      }
    },

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
    },

    renameKeyOfObject(obj, currentKey, newKey) {
      if (!obj || !obj[currentKey]) {
        return;
      }

      let key = this.getAcceptableKey(obj, newKey, currentKey);
      Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(obj, currentKey));
      delete obj[currentKey];

      return obj;
    },

    /* update the key values to reflect the property or name. this does not look at nested fields and elements, just top level */
    updateKeys(parent) {
      let properties = this.propertiesOf(parent);
      for (let key of properties.keys()) {
        if (!this.isSpecialKey(key)) {
          this.updateKey(key, properties[key], parent);
        }
      }
    },

    updateKey(key, node, parent) {
      if (!this.isRootNode(parent, node) && !this.hasVersion(node)) {
        var title = this.getTitle(node);
        var labels = this.getPropertyLabels(parent);
        var label = labels && labels[key];
        var descriptions = this.getPropertyDescriptions(parent);
        var description = descriptions && descriptions[key];
        this.relabel(parent, key, title, label, description);
      }
    },

    /* Relabel the field key with the field title */
    relabelField(schema, key, newKey, label, description) {
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
    },

    /* Relabel the element key with a new value from the propertyLabels */
    relabel(parent, key, title, label, description) {

      if (key != title) {
        let schema = this.schemaOf(parent);
        let properties = this.propertiesOf(parent);
        let newKey = this.getAcceptableKey(properties, label, key);

        for (let k of properties.keys()) {

          if (properties[k] && key == k) {
            this.relabelField(schema, key, newKey, label, description);
          }
        }
      }
    },
  };

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

  /* validate the template */
  checkValidation = function (template) {

    let node = Object.assign({}, template);

    if (node) {
      this.dms.stripTmps(node);
      this.dms.updateKeys(node);

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
