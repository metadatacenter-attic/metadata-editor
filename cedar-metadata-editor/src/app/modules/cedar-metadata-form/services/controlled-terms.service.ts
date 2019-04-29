import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DataHandlerService} from "../../../services/data-handler.service";
import {DataStoreService} from "../../../services/data-store.service";
import {DataHandlerDataStatus} from "../../../modules/shared/model/data-handler-data-status.model";
import {Post} from "../models/post";


@Injectable({
  providedIn: 'root'
})
export class ControlledTermService {
  public postsData: Post[];
  //postUrl : string = "https://jsonplaceholder.typicode.com/posts";
  httpHeaders: { headers: HttpHeaders };

  postUrl: string = "https://terminology.metadatacenter.orgx/bioportal/ontologies/NCIT/classes?page=1&page_size=500";
  dh: DataHandlerService;
  ds: DataStoreService;

  constructor(private http: HttpClient, dataHandler: DataHandlerService, dataStore: DataStoreService) {
    this.dh = dataHandler;
    this.ds = dataStore;
  }

  getPosts(ontologyId): Observable<Post[]> {

    // get ontology classes
    // this.dh
    //   .requireId(DataHandlerDataId.ONTOLOGY_CLASSES, ontologyId)
    //   .load(() => this.classesLoadedCallback(ontologyId), (error, dataStatus) => this.dataErrorCallback(error, dataStatus));

    let headers = new HttpHeaders().set('Authorization', 'apiKey ' + localStorage.getItem('apiKey'));
    return this.http.get<Post[]>(this.postUrl, {headers: headers});
  }

  private classesLoadedCallback(ontologyId) {
    const ontologyRootClasses = this.ds.getOntologyRootClasses(ontologyId);
    console.log('classesLoadedCallback', ontologyRootClasses)
  }

  private dataErrorCallback(error: any, dataStatus: DataHandlerDataStatus) {
    //this.artifactStatus = error.status;
    console.log('dataErrorCallback', error)
  }


  filteredListOptions(searchOption) {
    let posts = this.postsData;
    let filteredPostsList = [];
    for (let post of posts) {
      for (let options of searchOption) {
        if (options.title === post.title) {
          filteredPostsList.push(post);
        }
      }
    }
    return filteredPostsList;
  }
}
