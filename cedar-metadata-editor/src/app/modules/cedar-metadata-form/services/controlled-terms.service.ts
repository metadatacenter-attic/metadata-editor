import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {of} from "rxjs/internal/observable/of";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DataHandlerService} from "../../../services/data-handler.service";
import {DataStoreService} from "../../../services/data-store.service";
import {DataHandlerDataStatus} from "../../../modules/shared/model/data-handler-data-status.model";
import {Response} from "../models/response.model";
import {UrlService} from './url.service';


@Injectable({
  providedIn: 'root'
})
export class ControlledTermService {

  constructor(private http: HttpClient, private dh: DataHandlerService, private ds: DataStoreService) {
  }

  getPosts(searchOption: string, classLoader: any, valueConstraints: any): Observable<Response>[] {

    // get ontology classes
    // this.dh
    //   .requireId(DataHandlerDataId.ONTOLOGY_CLASSES, ontologyId)
    //   .load(() => this.classesLoadedCallback(ontologyId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));


    // do we have a search string?
    if (typeof searchOption === "string" && searchOption.length) {

      // build all the urls that capture the value constraints
      const urls: string[] = this.getUrls(searchOption, valueConstraints);
      let headers = new HttpHeaders().set('Authorization', 'apiKey ' + localStorage.getItem('apiKey'));
      let responses: Observable<Response>[] = [];
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

  getUrls(searchOption: string, valueConstraints: any): string[] {

    let result: string[] = [];
    if (valueConstraints.classes && valueConstraints.classes.length > 0) {
      // for (let i = 0; i < valueConstraints['classes'].length; i++) {
      //   let klass = valueConstraints.classes[i];
      //   console.log('klass', klass)
      //   const response: Response = {
      //     page: 0,
      //     pageCount: 1,
      //     pageSize: 1,
      //     prevPage: 0,
      //     nextPage: 0,
      //     collection: [{
      //       '@id': klass.uri,
      //       prefLabel: klass.label,
      //       source: 'template',
      //       type: klass.type,
      //       uri: klass.uri
      //     }]
      //   };
      //   const myObservable = of(response);
      //   result.push(myObservable);
      // }
    }

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

    // if (valueConstraints.actions  && vcst.actions.length > 0 && !next) {
    //
    //
    //   angular.forEach(vcst.actions, function (action) {
    //     if (action.action == 'move') {
    //
    //       if (!service.hasTerm(id, query, action.sourceUri, action['@id'])) {
    //         let uriArr = action.sourceUri.split('/');
    //         let classId = action['termUri'];
    //
    //         if (action.type == "Value") {
    //           let vsCollection = uriArr[uriArr.length - 2];
    //
    //           var promise =
    //             controlledTermDataService.getValueTermById(vsCollection, action.sourceUri, classId).then(
    //               function (childResponse) {
    //                 service.processAutocompleteClassResults(id, query, 'Value', action.sourceUri,
    //                   childResponse);
    //               });
    //         }
    //         if (action.type == "OntologyClass") {
    //           let acronym = uriArr[uriArr.length - 1];
    //
    //           var promise = controlledTermDataService.getClassById(acronym, classId).then(function (response) {
    //             service.processAutocompleteClassResults(id, query, 'OntologyClass', action.sourceUri, response);
    //           });
    //         }
    //       }
    //       promises.push(promise);
    //     }
    //
    //   });
    // }

    return result;
  }


  private classesLoadedCallback(ontologyId) {
    const ontologyRootClasses = this.ds.getOntologyRootClasses(ontologyId);
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    //this.artifactStatus = error.status;
  }


  // filteredListOptions(searchOption) {
  //   let posts = this.postsData;
  //   let filteredPostsList = [];
  //   for (let post of posts) {
  //     for (let options of searchOption) {
  //       if (options.title === post.title) {
  //         filteredPostsList.push(post);
  //       }
  //     }
  //   }
  //   return filteredPostsList;
  // }
}
