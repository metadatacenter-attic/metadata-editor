import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiUrlService {

  API_URL: string = environment.apiUrl;
  TERMINOLOGY_URL: string = environment.terminologyUrl;

  constructor() {
  }

  private base() {
    return `${this.API_URL}`;
  }

  private terminology() {
    return `${this.TERMINOLOGY_URL}`;
  }

  private controlled() {
    return `${this.TERMINOLOGY_URL}/bioportal/`;
  }

  private templateFields() {
    return `${this.base()}template-fields`;
  }

  private templateElements() {
    return `${this.base()}template-elements`;
  }

  private templates() {
    return `${this.base()}templates`;
  }

  private templateInstances() {
    return `${this.base()}template-instances`;
  }

  templateField(id: string) {
    return `${this.templateFields()}/${encodeURIComponent(id)}`;
  }

  templateElement(id: string) {
    return `${this.templateElements()}/${encodeURIComponent(id)}`;
  }

  template(id: string) {
    return `${this.templates()}/${encodeURIComponent(id)}`;
  }

  templateInstance(id: string) {
    return `${this.templateInstances()}/${encodeURIComponent(id)}`;
  }

  getOntologyRootClasses(id: string) {
    return `${this.controlled()}ontologies/${encodeURIComponent(id)}/classes/roots`;
  }

  paging(page, size, defaultPage, defaultSize, pageString, sizeString) {
    let p = page > 0 ? page : defaultPage;
    let s = size > 0 ? size : defaultSize;
    return pageString + '=' + p + '&' + sizeString + '=' + s;
  };

  getValuesInValueSet(vsCollection, vsId, page?: string, size?: string) {
    let paging = this.paging(page, size, 1, 50, 'page', 'pageSize');
    return `${this.controlled()}vs-collections/${vsCollection}/value-sets/${encodeURIComponent(vsId)}/values?${paging}`;
  };

  autocompleteOntology(query: string, acronym: string, page?: number, size?: number) {
    let paging = this.paging(page, size, 1, 500, 'page', 'pageSize');
    if (query == '*') {
      return `${this.controlled()}ontologies/${acronym}/classes?${paging}`;
    } else {
      return `${this.controlled()}search?q=${encodeURIComponent(query)}&scope=classes&sources=${acronym}&suggest=true&${paging}`;
    }
  };

  autocompleteOntologySubtree(query, acronym, subtree_root_id, max_depth?: number, page?: number, size?: number) {
    let paging = this.paging(page, size, 1, 500, 'page', 'pageSize');
    if (query == '*') {
      return `${this.controlled()}ontologies/${acronym}/classes/${encodeURIComponent(subtree_root_id)}/descendants?${paging}`;
    } else {
      return `${this.controlled()}search?q=${encodeURIComponent(query)}&scope=classes&source=${acronym}&subtree_root_id=${encodeURIComponent(subtree_root_id)}&max_depth=${max_depth}&suggest=true&${paging}`;
    }
  };


}
