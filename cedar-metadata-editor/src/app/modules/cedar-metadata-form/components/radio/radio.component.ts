import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";

@Component({
  selector: 'cedar-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less']
})
export class RadioComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() node: FileNode;
  @Output() changed = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onChanges(node: FileNode, index:number, formGroup: any) {
    console.log('onChanges', formGroup);
    // this.changed.emit({
    //   'type': node.type,
    //   'subtype': node.subtype,
    //   'model': node.model,
    //   'key': node.key,
    //   'index': index,
    //   'location': node.valueLocation,
    //   'value': value
    // });
  }

}
