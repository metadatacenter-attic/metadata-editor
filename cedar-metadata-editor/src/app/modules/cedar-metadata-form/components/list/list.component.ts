import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";
import {TemplateSchemaService} from "../../services/template-schema.service";

@Component({
  selector: 'cedar-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() node: FileNode;
  @Output() changed = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
    // initialize the value
    this.formGroup.get(this.node.key + 'list').setValue(this.getListValue(this.node.options, this.node.model[this.node.key], this.node.valueLocation, this.node.multipleChoice))

    // watch for changes
    this.formGroup.get(this.node.key + 'list').valueChanges.subscribe(value => {
      this.node.model[this.node.key] = this.setListValue(value, this.node.options, this.node.model[this.node.key], this.node.valueLocation, this.node.multipleChoice);

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
  getListValue(literals, value, valueLocation, multiple) {
    let result;
    let map = this.getLiteralMap(literals);
    if (multiple) {
      result = [];
      for (let i = 0; i < value.length; i++) {
        result.push(map.indexOf(value[i][valueLocation]));
      }
    } else {
      result = map.indexOf(value[valueLocation]);
    }
    return result;
  }

  // get the form value into the model
  setListValue(value, literals, model, valueLocation, multiple) {
    let result;
    let map = this.getLiteralMap(literals);
    if (multiple) {
      result = [];
      for (let i = 0; i < value.length; i++) {
        let obj = {};
        obj[valueLocation] = map[value[i]];
        result.push(obj);
      }
    } else {
      result = {};
      result[valueLocation] = map[value];
    }
    return result;
  }

}
