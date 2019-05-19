import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";
import {TemplateService} from "../../services/template.service";

@Component({
  selector: 'cedar-attribute-value',
  templateUrl: './attribute-value.component.html',
  styleUrls: ['./attribute-value.component.less']
})
export class AttributeValueComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() node: FileNode;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    // initialize the value
    this.formGroup.get('values').setValue(this.getValue(this.node), this.node);
    this.watchChanges();
  }

  watchChanges() {
    // watch for changes
    this.formGroup.get('values').valueChanges.subscribe(value => {
      // update our metadata model
      this.setValue(value, this.node);


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


  setAttributeValue(model, key, index, location, val) {
    let itemKey = model[key][index];
    if (itemKey) {

      if (location === 'value') {
        // change the value
        model[itemKey]['@value'] = val;

      } else {
        // change the label
        const itemValue = model[itemKey]['@value'];
        const index = model[key].indexOf(itemKey);
        delete model[itemKey];
        model['@context'][val] = model['@context'][itemKey];
        delete model['@context'][itemKey];
        model[key][index] = val;
        model[val] = {'@value': itemValue}
      }
    } else {
      // initialize attribute value field with this itemKey
      let newKey = val;
      while (model.hasOwnProperty(newKey)) {
        newKey = newKey + '1';
      }
      model['@context'][newKey] = "https://schema.metadatacenter.org/properties/" + TemplateService.generateGUID();
      model[key] = [newKey];
      model[newKey] = {'@value': val};
    }
  }

  // get the form value into the model
  private setValue(value, node) {
    value.forEach((val, i) => {
      this.setAttributeValue(node.model, node.key, i, 'label', val['values'][0]);
      this.setAttributeValue(node.model, node.key, i, 'value', val['values'][1]);
    });
  }

// get the form value from the metadata model
  private getValue(node): any[] {
    let val = [];
    if (node.model[node.key]) {
      const itemCount = node.model[node.key].length;
      const modelValue = (node.model && node.model[node.key]) ? node.model[node.key] : [];

      if (itemCount == 0) {
        val.push({'values':[null,null]})
      } else {
        for (let i = 0; i < itemCount; i++) {
          const itemKey = modelValue[i];
          const itemValue = node.model[itemKey]['@value'];
          val.push({'values':[itemKey, itemValue]})
        }
      }
    } else {
      val.push({'values':[null,null]})
    }
    return val;
  }

  // build the av form controls
  private buildAV(node: FileNode, disabled: boolean): any[] {

    const arr = [];
    node.model[node.key].forEach((value) => {
      const items = [];
      items.push(new FormControl({value: '', disabled: disabled}));
      items.push(new FormControl({value: '', disabled: disabled}));
      const group = this.fb.group({values: this.fb.array(items)});
      arr.push(group);
    });
    return arr;
  }

  copyAttributeValue(model, key, index) {
    const oldKey = model[key][index];
    const oldValue = model[oldKey]['@value'];
    let newKey = oldKey;
    while (model.hasOwnProperty(newKey)) {
      newKey = newKey + '1';
    }
    model['@context'][newKey] = "https://schema.metadatacenter.org/properties/" + TemplateService.generateGUID();
    model[key].splice(index + 1, 0, newKey);
    model[newKey] = {'@value': oldValue};
  };


  copy(node: FileNode, index: number) {
    this.copyAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values', this.fb.array(this.buildAV(this.node, this.disabled)));
    this.formGroup.get('values').setValue(this.getValue(this.node));
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
    this.watchChanges();

  }

  // remove the attribute value field pair at index
  removeAttributeValue(model, key, index) {
    const oldKey = model[key][index];
    delete model['@context'][oldKey];
    model[key].splice(index, 1);
    delete model[oldKey]
  };

  removeable(node: FileNode) {
    return node.model[node.key].length > 1;
  }

  remove(node: FileNode, index: number) {
    if (node.model[node.key].length > 1) {
      this.removeAttributeValue(node.model, node.key, index);
      this.formGroup.setControl('values', this.fb.array(this.buildAV(this.node, this.disabled)));


      //this.buildAV(node, this.disabled);
      this.formGroup.get('values').setValue(this.getValue(this.node));
      this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
    }
  }

}
