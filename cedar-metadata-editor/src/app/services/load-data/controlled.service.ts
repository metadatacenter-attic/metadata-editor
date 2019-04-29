import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {RestApiUrlService} from '../rest-api-url.service';
import {Router} from '@angular/router';
import {GenericMultiLoaderService} from './generic-multi-loader';
import {ControlledOntology} from '../../shared/model/controlled-ontology.model';
import {SnotifyService} from 'ng-snotify';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ControlledService extends GenericMultiLoaderService<ControlledOntology> {

  protected constructor(
    protected http: HttpClient,
    protected restApiUrl: RestApiUrlService,
    protected router: Router,
    protected notify: SnotifyService,
    protected translateService: TranslateService
  ) {
    super(http, restApiUrl, router, notify, translateService);
  }

  getOntologyRootClasses(ontologyId: string, errorCallback: Function): Observable<ControlledOntology> {
    return this.getData(ontologyId, this.restApiUrl.getOntologyRootClasses(ontologyId), errorCallback);
  }
}
