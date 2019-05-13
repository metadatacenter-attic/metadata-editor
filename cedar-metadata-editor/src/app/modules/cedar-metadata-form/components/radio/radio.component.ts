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
    // initialize the value
    this.formGroup.get(this.node.key + 'radio').setValue(this.getValue(this.node.options, this.node.model[this.node.key], this.node.valueLocation));

    // watch for changes
    this.formGroup.get(this.node.key + 'radio').valueChanges.subscribe(value => {
      this.node.model[this.node.key] = this.setValue(value, this.node.options, this.node.model[this.node.key], this.node.valueLocation);

      // fire off change message to parent
      this.changed.emit({
        'type': this.node.type,
        'subtype': this.node.subtype,
        'model': this.node.model,
        'key': this.node.key,
        'index': 0,
        'location': this.node.valueLocation,
        'value': value
      });
    })
  }

  getLiteralMap(literals) {
    let map = literals
      .map(function (element) {
        return element.label;
      });
    return map;
  }

  // get the value out of the model and into something the form can edit
  getValue(literals, model, valueLocation) {
    return this.getLiteralMap(literals).indexOf(model[valueLocation]);
  }

  // get the form value into the model
  setValue(value, literals, model, valueLocation) {
    let result = {};
    result[valueLocation] = this.getLiteralMap(literals)[value];
    return result;
  }

}
