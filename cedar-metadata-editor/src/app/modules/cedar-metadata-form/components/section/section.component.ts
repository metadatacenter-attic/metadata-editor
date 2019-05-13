import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";


@Component({
  selector: 'cedar-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less']
})
export class SectionComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() node: FileNode;

  constructor() {
  }

  ngOnInit() {
  }



}
