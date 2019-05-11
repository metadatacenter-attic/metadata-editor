import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FileNode} from "../../models/file-node";
import {TemplateSchemaService} from "../../services/template-schema.service";
import {NgxYoutubePlayerModule} from "ngx-youtube-player";

@Component({
  selector: 'cedar-attribute-value',
  templateUrl: './attribute-value.component.html',
  styleUrls: ['./attribute-value.component.less']
})
export class AttributeValueComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() control: FormControl;
  @Input() node: FileNode;
  @Input() disabled: boolean;
  @Input() index: number;
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
      model['@context'][newKey] = "https://schema.metadatacenter.org/properties/" + TemplateSchemaService.generateGUID();
      model[key] = [newKey];
      model[newKey] = {'@value': val};
    }
  }

  // get the form value into the model
  private setValue(value,  node) {
    value.forEach((val, i) => {
      this.setAttributeValue(node.model, node.key, i, 'label', val['values'][0]);
      this.setAttributeValue(node.model, node.key, i, 'value', val['values'][1]);
    });
  }

  // get the value out of the model and into something the form can edit
  private getValue(node): any[] {
    const arr = [];
    if (node.model[node.key].length == 0) {
      arr.push({values:[node.key + ' label',node.key + ' value']});
    } else {
      node.model[node.key].forEach((value) => {
        arr.push({'values' : [  value, node.model[value]['@value']  ]});
      });
    }
    return arr;
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
    model['@context'][newKey] = "https://schema.metadatacenter.org/properties/" + TemplateSchemaService.generateGUID();
    model[key].splice(index + 1, 0, newKey);
    model[newKey] = {'@value': oldValue};
  };


  copy(node: FileNode, index: number) {
    this.copyAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values',this.fb.array(this.buildAV(this.node, this.disabled)));
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

  remove(node: FileNode, index: number) {

    this.removeAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values',this.fb.array(this.buildAV(this.node, this.disabled)));


    //this.buildAV(node, this.disabled);
    this.formGroup.get('values').setValue(this.getValue(this.node));
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

}
