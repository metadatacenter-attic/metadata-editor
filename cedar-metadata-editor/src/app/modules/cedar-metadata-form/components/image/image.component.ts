import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";


@Component({
  selector: 'cedar-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() node: FileNode;


  constructor() {}

  ngOnInit() {
  }



  getImageWidth(node: FileNode) {
    let result = 367;
    if (node.size && node.size.width && Number.isInteger(node.size.width)) {
      result = node.size.width;
    }
    return result;
  }

  getImageHeight(node: FileNode) {
    if (node.size && node.size.height && Number.isInteger(node.size.height)) {
      return node.size.height;
    }
  }


}
