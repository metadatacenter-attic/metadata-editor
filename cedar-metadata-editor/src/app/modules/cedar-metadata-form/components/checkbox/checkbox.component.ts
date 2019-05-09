import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";

@Component({
  selector: 'cedar-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.less']
})
export class CheckboxComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() control: FormControl;
  @Input() node: FileNode;
  @Input() index: number;
  @Output() changed = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  isChecked(node,  label) {
    let result = false;
    node.model[node.key].forEach((value, i) => {
      if (value[node.valueLocation] == label) {
        result = true;
      }
    });
    return result;
  }

  onChanged(node:FileNode,  label:string, value:boolean) {
    if (value != this.isChecked(node, label)) {
      if (value) {
        let obj = {}
        obj[node.valueLocation] = label
        node.model[node.key].push(obj);
      } else {
        node.model[node.key].forEach((value, i) => {
          if (value[node.valueLocation] == label) {
            node.model[node.key].splice(node.model[node.key][i], 1);
          }
        });
      }
    }
  }

}
