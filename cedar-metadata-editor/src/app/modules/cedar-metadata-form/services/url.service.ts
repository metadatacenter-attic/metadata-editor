import {environment} from "../../../../environments/environment";

export class UrlService {

  static terminologyService = environment.terminologyUrl;
  static controlledService = environment.terminologyUrl + 'bioportal';

  static paging(page, size, defaultPage, defaultSize, pageString, sizeString) {
    let p = page > 0 ? page : defaultPage;
    let s = size > 0 ? size : defaultSize;
    return pageString + '=' + p + '&' + sizeString + '=' + s;
  };


  static terminology() {
    return this.terminologyService;
  };

  static controlledTerm() {
    return this.controlledService;
  };

  static getOntologies() {
    return this.controlledTerm() + "/ontologies";
  };

  static getValueSetsCollections() {
    return this.controlledTerm() + "/vs-collections";
  };

  static createValueSet() {
    return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets';
  };

  static getValueSetById(vsId) {
    return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(vsId);
  };

  static getValueSetsCache() {
    return this.controlledTerm() + "/value-sets";
  };

  static getRootClasses(ontology) {
    return this.controlledTerm() + "/ontologies/" + ontology + "/classes/roots";
  };

  static getRootProperties(ontology) {
    return this.controlledTerm() + "/ontologies/" + ontology + "/properties/roots";
  };

  static createClass() {
    return this.controlledTerm() + '/ontologies/CEDARPC/classes';
  };

  static getClassById(acronym, classId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId);
  };

  static createValue(vsId) {
    return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(vsId) + '/values';
  };

  static getValueTree(vsId, vsCollection) {
    return this.controlledTerm() + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(vsId)
      + "/tree";
  };

  static getValueSetTree(valueId, vsCollection) {
    return this.controlledTerm() + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(valueId)
      + "/tree";
  };

  static getAllValuesInValueSetByValue(valueId, vsCollection, page, size) {
    console.log('getAllValuesInValueSetByValue');
    return this.controlledTerm() + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(valueId)
      + "/all-values?" + this.paging(page, size, 1, 50, 'page', 'page_size');
  };

  static getClassChildren(acronym, classId, page, size) {
    console.log('getClassChildreen', acronym, classId);
    return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
      + "/children?" + this.paging(page, size, 1, 1000, 'page', 'pageSize');
  };

  static getClassDescendants(acronym, classId, page, size) {
    console.log('getClassDescendants', acronym, classId);
    return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
      + "/descendants?" + this.paging(page, size, 1, 1000, 'page', 'pageSize');
  };


  static getPropertyChildren(acronym, propertyId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(propertyId)
      + "/children";
  };

  static getPropertyById(acronym, propertyId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(propertyId);
  };

  static getValueTermById(acronym, valueSetId, valueId) {
    return this.controlledTerm() + '/vs-collections/' + acronym + '/values/' + encodeURIComponent(valueId);
  };

  static getValueById(acronym, valueId) {
    return this.controlledTerm() + '/vs-collections/' + acronym + '/values/' + encodeURIComponent(valueId);
  };

  static getClassParents(acronym, classId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
      + '/parents?include=hasChildren,prefLabel';
  };

  static getClassTree(acronym, classId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/tree';
  };

  static getPropertyTree(acronym, propertyId) {
    return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(
      propertyId) + '/tree';
  };

  static getValuesInValueSet(vsCollection, vsId, page?:string, size?:string) {
    return this.controlledTerm() + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(vsId)
      + "/values?" + this.paging(page, size, 1, 50, 'page', 'pageSize');
  };

  static searchClasses(query, sources, size, page) {
    var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query)
      + "&scope=classes&" + this.paging(page, size, 1, 1000, 'page', 'page_size');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static searchProperties(query, sources, size, page) {
    var url = this.controlledTerm() + "/property_search?q=" + encodeURIComponent(query)
      + "&" + this.paging(page, size, 1, 50, 'page', 'pageSize');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static searchClassesAndValues(query, sources, size, page) {
    let url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query)
      + "&scope=classes,values&" + this.paging(page, size, 1, 50, 'page', 'page_size');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static searchClassesValueSetsAndValues(query, sources, size, page) {
    var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
      "&scope=all&" + this.paging(page, size, 1, 50, 'page', 'page_size');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static searchValueSetsAndValues(query, sources, size, page) {
    let url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
      "&scope=value_sets,values&" + this.paging(page, size, 1, 50, 'page', 'page_size');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static searchValueSets(query, sources, size, page) {
    let url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
      "&scope=value_sets&" + this.paging(page, size, 1, 50, 'page', 'page_size');
    if (sources) {
      url += "&sources=" + sources;
    }
    return url;
  };

  static autocompleteOntology(query:string, acronym:string, page?:number, size?:number) {
    let url = this.controlledTerm();
    if (query == '*') {
      url += "/ontologies/" + acronym + "/classes?" + this.paging(page, size, 1, 500, 'page', 'page_size');
    } else {
      url += "/search?q=" + encodeURIComponent(query) +
        "&scope=classes&sources=" + acronym + "&suggest=true&" + this.paging(page, size, 1, 500, 'page', 'page_size');
    }
    console.log('autocompleteOntology',url)
    return url;
  };

  static autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth?:number, page?:number, size?:number) {
    let url = this.controlledTerm();

    if (query == '*') {
      url += '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id)
        + '/descendants?' + this.paging(page, size, 1, 500, 'page', 'page_size');
    } else {
      url += '/search?q=' + encodeURIComponent(query) + '&scope=classes' + '&source=' + acronym +
        '&subtree_root_id=' + encodeURIComponent(subtree_root_id) + '&max_depth=' + max_depth +
        "&suggest=true&" + this.paging(page, size, 1, 500, 'page', 'page_size');
    }

    return url;
  };


}
