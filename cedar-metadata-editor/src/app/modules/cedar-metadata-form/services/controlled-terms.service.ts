import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {of} from "rxjs/internal/observable/of";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Response} from "../models/response.model";
import {UrlService} from './url.service';


@Injectable({
  providedIn: 'root'
})
export class ControlledTermService {

  constructor(private http: HttpClient) {
  }

  getPosts(searchOption: string,  valueConstraints: any): Observable<Response>[] {

    // do we have a search string?
    if (typeof searchOption === "string" && searchOption.length) {

      // build all the urls that capture the value constraints
      const urls: string[] = this.getUrls(searchOption, valueConstraints);
      let headers = new HttpHeaders().set('Authorization', 'apiKey ' + localStorage.getItem('apiKey'));
      let responses: Observable<Response>[] = this.getClasses(searchOption, valueConstraints);
      for (let i = 0; i < urls.length; i++) {
        responses.push(this.http.get<Response>(urls[i], {headers: headers}));
      }
      return responses;

    } else {
      // no, so return an empty response
      const response: Response = {
        page: 0,
        pageCount: 1,
        pageSize: 1,
        prevPage: 0,
        nextPage: 0,
        collection: []
      };
      const myObservable = of(response);
      return [myObservable];
    }
  }

  private getClasses(searchOption: string, valueConstraints: any): Observable<Response>[] {
    let result = [];
    let myObservable:Observable<Response>;
    if (valueConstraints.classes && valueConstraints.classes.length > 0) {

      for (let i = 0; i < valueConstraints['classes'].length; i++) {
        let klass = valueConstraints.classes[i];
        const response: Response = {
          page: 0,
          pageCount: 1,
          pageSize: 1,
          prevPage: 0,
          nextPage: 0,
          collection: [{
            '@id': klass.uri,
            prefLabel: klass.label,
            source: 'template',
            type: klass.type,
            uri: klass.uri
          }]
        };
        myObservable = of(response);
        result.push(myObservable);
      }
    }
    return result;
  }


  private getUrls(searchOption: string, valueConstraints: any): string[] {
    let result: string[] = [];
    if (valueConstraints['valueSets'] && valueConstraints['valueSets'].length > 0) {
      for (let i = 0; i < valueConstraints['valueSets'].length; i++) {
        let valueSet = valueConstraints['valueSets'][i];
        let acronym = valueSet.vsCollection.substr(valueSet.vsCollection.lastIndexOf('/') + 1);
        result.push(UrlService.getValuesInValueSet(acronym, valueSet.uri));
      }
    }
    if (valueConstraints['ontologies'] && valueConstraints['ontologies'].length > 0) {
      for (let i = 0; i < valueConstraints['ontologies'].length; i++) {
        let ontology = valueConstraints['ontologies'][i];
        result.push(UrlService.autocompleteOntology(searchOption, ontology['acronym']));
      }
    }
    if (valueConstraints.branches && valueConstraints.branches.length > 0) {
      for (let i = 0; i < valueConstraints['branches'].length; i++) {
        let branch = valueConstraints['branches'][i];
        let maxDepth = 10;
        result.push(UrlService.autocompleteOntologySubtree(searchOption, branch['acronym'], branch['uri'], maxDepth));
      }
    }
    return result;
  }

}
