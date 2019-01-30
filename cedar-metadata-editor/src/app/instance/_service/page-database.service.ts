/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */

import {Injectable} from '@angular/core';

import {FileDatabase} from './file-database';

/**
 * The page structure tree data in string.
 */



@Injectable()
export class PageDatabase {

  pages: FileDatabase;

  constructor() {
    this.pages = new FileDatabase();
  }

}
