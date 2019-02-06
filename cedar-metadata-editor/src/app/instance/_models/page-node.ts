import {FileNode} from "./file-node";


export interface PageNode {
  page: FileNode;
  pageName: string;
  helpText: string;
  optional: boolean;
}
