import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {InputTypeService} from "../../services/input-type.service";
import {InputType} from "../../models/input-type";

import {TemplateSchemaService} from "../../services/template-schema.service";
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
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
  providers: []
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @Input() node: FileNode;
  @Input() classLoader: any;
  @Input() parentGroup: FormGroup;
  @Input() disabled: boolean;
  @Output() changed = new EventEmitter<any>();

  formGroup: FormGroup;
  // controlled: ControlledComponent;
  // date:DateComponent;
  // controlledGroup: FormGroup;
  matcher = new MyErrorStateMatcher();
  _yt;
  player;


  constructor(private fb: FormBuilder) {
    //this._yt = new NgxYoutubePlayerModule();
    //this.player = this.yt.Player;
  }

  ngAfterViewInit() {
  }

  // savePlayer(player) {
  //   this.player = player;
  //   console.log('player instance', player);
  // }
  //
  // onStateChange(event) {
  //   console.log('player state', event.data);
  // }

  ngOnInit() {

    // build the array of controls and add it to the parent
    const validators = this.getValidators(this.node);
    let name;
    let obj;

    switch (this.node.type) {

      case InputType.static:
      case InputType.youTube:
      case InputType.image:
      case InputType.sectionBreak:
      case InputType.pageBreak:
      case InputType.richText:
        this.formGroup = this.fb.group({values: this.fb.array([])});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.controlled:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildControlled(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.date:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildDate(this.node, this.disabled, validators))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.textfield:
      case InputType.textarea:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildText(this.node, this.disabled, validators))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.radio:
        name = this.node.key + 'radio';
        obj = {};
        obj[name] = new FormControl(this.fb.array([]));
        this.formGroup = this.fb.group(obj);
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.checkbox:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildCheckbox(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.list:
        name = this.node.key + 'list';
        obj = {};
        obj[name] = new FormControl(this.fb.array([]));
        this.formGroup = this.fb.group(obj);
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;

      case InputType.attributeValue:
        this.formGroup = this.fb.group({values: this.fb.array(this.buildAV(this.node, this.disabled))});
        this.parentGroup.addControl(this.node.key, this.formGroup);
        break;


    }
  }

  // controlled term was selected
  onSelectedControlled(event) {
    TemplateSchemaService.addControlledValue(this.node.model, this.node.key, event['@id'], event['prefLabel']);
  }

  // controlled term was removed
  onRemovedControlled(index) {
    TemplateSchemaService.removeControlledValue(this.node.model, this.node.key, index);
  }

  allowsMultiple(type: InputType) {
    return type !== InputType.element && InputTypeService.allowsMultiple(type);
  }

  getValidators(node: FileNode) {
    const validators = [];
    if (node.required) {
      validators.push(Validators.required);
    }
    if (node.subtype === InputType.email) {
      validators.push(Validators.email);
    }
    if (node.min !== null) {
      validators.push(Validators.min(node.min));
    }
    if (node.max !== null) {
      validators.push(Validators.max(node.max));
    }
    if (node.subtype == InputType.numeric) {
      validators.push(this.numericValidator());
    }
    if (node.decimals) {
      validators.push(this.decimalValidator(node.decimals));
    }
    if (node.minLength !== null) {
      validators.push(Validators.minLength(node.minLength));
    }
    if (node.maxLength !== null) {
      validators.push(Validators.maxLength(node.maxLength));
    }
    if (node.pattern !== null) {
      validators.push(Validators.pattern(node.pattern));
    }
    if (node.subtype === InputType.url) {
      validators.push(this.urlValidator);
    }
    return validators;
  }

  // validator for min and max
  quantityRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
        return {'quantityRange': true};
      }
      return null;
    };
  }

  // validator for URLs
  numericValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let result = null;
      if (control.value) {
        if (isNaN(Number(control.value))) {
          result = {'numeric': true};
        }
      }
      return result;
    };
  }

  // validator for precision of a number
  decimalValidator(precision: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: { actual: number, required: number } } | null => {
      let result = null;
      if (control.value && (!isNaN(Number(control.value)))) {
        const actual = control.value.split(".")[1].length;
        if (precision !== actual) {
          result = {
            decimal: {
              actual: actual,
              required: precision
            }
          };
        }
      }
      return result;
    };
  }

  // validator for URLs
  urlValidator(url: FormControl): any {
    if (url.pristine) {
      return null;
    }
    const URL_REGEXP = /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    url.markAsTouched();
    if (URL_REGEXP.test(url.value)) {
      return null;
    }
    return {
      url: true
    };
  }

  get isValid() {
    let result = false;
    if (this.parentGroup && this.parentGroup.controls.hasOwnProperty(this.node.key)) {
      result = this.parentGroup.controls[this.node.key].valid;
    }
    return result;
  }

  isChecked(node, label) {
    let result = false;
    node.model[node.key].forEach((value, i) => {
      if (value[node.valueLocation] == label) {
        result = true;
      }
    });
    return result;
  }

  // setRadio(node:FileNode, value:string) {
  //   console.log('setRadio', value);
  //   let obj = {};
  //   obj[node.valueLocation] = value
  //   node.model[node.key] = obj;
  //
  // };

  setDate(node: FileNode, index: number, value) {
    console.log('setDate', index, value);
    node.value[index] = value;
  };

  setChecked(node: FileNode, label: string, value: boolean) {
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


  copyAV(node: FileNode, index: number) {
    TemplateSchemaService.copyAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values', this.fb.array(this.buildAV(node, this.disabled)));
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  removeAV(node: FileNode, index: number) {
    TemplateSchemaService.removeAttributeValue(node.model, node.key, index);
    this.formGroup.setControl('values', this.fb.array(this.buildAV(node, this.disabled)));
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  // do you want to filter dates out of the calendar?
  dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };


  addNewItem(index: number) {
    const validators = this.getValidators(this.node);


    let obj;
    switch (this.node.type) {

      case InputType.controlled:
        // this.node.value.splice(index, 0, this.node.value[index]);
        // this.node.label.splice(index, 0, this.node.label[index]);
        obj = Object.assign({}, this.node.model[this.node.key][index]);
        this.node.model[this.node.key].splice(index, 0, this.node.model[this.node.key][index]);
        this.formGroup.setControl('values', this.fb.array(this.buildControlled(this.node, this.disabled)));
        break;

      case InputType.textfield:
      case InputType.textarea:
        obj = Object.assign({}, this.node.model[this.node.key][index]);
        if (Array.isArray(this.node.model[this.node.key])) {
          this.node.model[this.node.key].splice(index, 0, obj);
        } else {
          this.node.model[this.node.key] = [obj, obj];
        }
        this.formGroup.setControl('values', this.fb.array(this.buildText(this.node, this.disabled, validators)));
        break;

      case InputType.date:
        obj = Object.assign({}, this.node.model[this.node.key][index]);
        if (Array.isArray(this.node.model[this.node.key])) {
          this.node.model[this.node.key].splice(index, 0, obj);
        } else {
          this.node.model[this.node.key] = [obj, obj];
        }
        this.formGroup.setControl('values', this.fb.array(this.buildDate(this.node, this.disabled, validators)));
        this.formGroup.updateValueAndValidity({onlySelf: true, emitEvent: true});

        break;
    }

    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  deleteLastItem(index: number) {
    const validators = this.getValidators(this.node);
    switch (this.node.type) {

      case InputType.controlled:
        // this.node.value.splice(index, 0, this.node.value[index]);
        // this.node.label.splice(index, 0, this.node.label[index]);
        this.node.model[this.node.key].splice(index, 1);
        this.formGroup.setControl('values', this.fb.array(this.buildControlled(this.node, this.disabled)));
        break;

      case InputType.textfield:
      case InputType.textarea:
        // this.node.value.splice(index, 0,this.node.value[index])
        this.node.model[this.node.key].splice(index, 1);
        this.formGroup.setControl('values', this.fb.array(this.buildText(this.node, this.disabled, validators)));
        console.log(this.node.model[this.node.key]);
        break;

    }
    this.formGroup.updateValueAndValidity({onlySelf: false, emitEvent: true});
  }

  loadForm(key, form) {
    console.log('load the form with key', key, form);
  }


  private buildList(node, disabled: boolean): any[] {
    const arr = node.options.map(opt => {
      return new FormControl({value: '', disabled: disabled});
      ;
    });
    return arr;

  }

  private buildCheckbox(node, disabled: boolean): any[] {
    const arr = node.options.map(opt => {
      return this.fb.control({value: false, disabled: disabled});
    });
    return arr;
  }


  private buildText(node: FileNode, disabled: boolean, validators): any[] {
    const arr = [];
    let length = node.model[node.key].length || 1;
    for (let i = 0; i < length; i++) {
      arr.push(new FormControl({value: '', disabled: disabled}, validators));
    }
    return arr;
  }

  private buildDate(node, disabled: boolean, validators): any[] {
    const arr = [];
    node.model[node.key].forEach((value, i) => {
      const control = new FormControl({value: null, disabled: disabled, validators});
      arr.push(control);
    });
    return arr;
  }

  private buildControlled(node: FileNode, disabled: boolean): any[] {
    const arr = [];
    node.model[node.key].forEach((value) => {
      let group = this.fb.group({
        chips: this.fb.array([value['rdfs:label']]),
        ids: this.fb.array([value['@id']]),
        search: new FormControl({disabled: disabled})
      });
      arr.push(group);
    });
    return arr;
  };

  // build the av form controls
  private buildAV(node: FileNode, disabled: boolean): any[] {
    console.log('buildAV', node);
    const arr = [];
    node.model[node.key].forEach((value) => {
      console.log('buildAV', value, node.model[value['rdfs:label']]);
      const items = [];
      items.push(new FormControl({value: value['rdfs:label'], disabled: disabled}));
      items.push(new FormControl({value: node.model[value['rdfs:label']]['@value'], disabled: disabled}));
      const group = this.fb.group({values: this.fb.array(items)});
      arr.push(group);
    });
    return arr;
  }

  onChange(event) {
    this.broadcastChanges(event);
  }
  
  broadcastChanges(event) {
    this.changed.emit({
      'type': event.type,
      'subtype': event.subtype,
      'model': event.model,
      'key': event.key,
      'index': event.index,
      'location': event.valueLocation,
      'value': event.value
    });
  }

}

