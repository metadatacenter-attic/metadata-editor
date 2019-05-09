import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm} from "@angular/forms";
import {FileNode} from "../../models/file-node";
import {ErrorStateMatcher} from "@angular/material";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'cedar-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.less']
})
export class TextareaComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() control: FormControl;
  @Input() node: FileNode;
  @Input() index: number;
  @Output() changed = new EventEmitter<any>();

  matcher = new MyErrorStateMatcher();

  constructor() { }

  ngOnInit() {
    // initialize the value
    this.formGroup.get('values').setValue(this.getValue(this.node.model[this.node.key], this.node.valueLocation))

    // watch for changes
    this.formGroup.get( 'values').valueChanges.subscribe(value => {
      // update our metadata model
      this.node.model[this.node.key] = this.setValue(value, this.node.model[this.node.key], this.node.valueLocation);

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

  // get the value out of the model and into something the form can edit
  getValue(model, valueLocation) {
    let result = [];
    let m = Array.isArray(model) ? model : [model];
    m.forEach((value, i) => {
      result.push(value[valueLocation] || '')
    });
    return result;
  }


  // get the form value into the model
  setValue(value, model, valueLocation) {
    let result;
    if (value.length > 1) {
      result = [];
      value.forEach((val, i) => {
        let obj = {};
        obj[valueLocation] = val;
        result.push(obj)
      });
    } else if (value.length == 1) {
      result = {};
      result[valueLocation] = value[0];
    }
    return result;
  }
}
