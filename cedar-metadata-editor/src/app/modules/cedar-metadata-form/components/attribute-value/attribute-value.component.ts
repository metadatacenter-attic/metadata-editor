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
  }

  onAVChanges(node: FileNode, index: number, location: string, value: any) {
    TemplateSchemaService.setAttributeValue(node.model, node.key, index, location, value);
    this.formGroup.setControl('values',this.fb.array(this.buildAV(node, this.disabled))) ;
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
    this.changed.emit({
      'type': node.type,
      'subtype': node.subtype,
      'model': node.model,
      'key': node.key,
      'index': index,
      'location': location,
      'value': value
    });
  }

  // build the av form controls
  private buildAV(node:FileNode, disabled:boolean):any[] {
    console.log('buildAV',node);
    const arr = [];
    node.model[node.key].forEach((value) => {
      console.log('buildAV',value, node.model[value['rdfs:label']]);
      const items = [];
      items.push(new FormControl({value: value['rdfs:label'], disabled: disabled}));
      items.push(new FormControl({value: node.model[value['rdfs:label']]['@value'], disabled: disabled}));
      const group = this.fb.group({values: this.fb.array(items)});
      arr.push(group);
    });
    return arr;
  }

  copyAV(node: FileNode, index: number) {
    TemplateSchemaService.copyAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values',this.fb.array(this.buildAV(node, this.disabled))) ;
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  removeAV(node: FileNode, index: number) {
    TemplateSchemaService.removeAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values',this.fb.array(this.buildAV(node, this.disabled))) ;
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }




}
