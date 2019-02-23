import {Injectable} from "@angular/core";
import { Post } from '../_models/post';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ControlledTermService {
  public postsData: Post[];
  postUrl : string = "https://jsonplaceholder.typicode.com/posts";

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]>{

    return this.http.get<Post[]>(this.postUrl);
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
