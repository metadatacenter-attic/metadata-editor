import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";

@Component({
  selector: 'cedar-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.less']
})
export class DateComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() control: FormControl;
  @Input() node: FileNode;
  @Input() index: number;
  @Output() changed = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  setDate(node:FileNode, index:number, value) {
    node.value[index] = value;
  };

  onChanges(node: FileNode, index: number, value: any) {
    this.changed.emit({
      'type': node.type,
      'subtype': node.subtype,
      'model': node.model,
      'key': node.key,
      'index': index,
      'location': node.valueLocation,
      'value': value
    });
  }
}
