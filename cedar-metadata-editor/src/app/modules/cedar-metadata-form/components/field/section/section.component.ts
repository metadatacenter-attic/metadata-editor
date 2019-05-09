import {Component, Input, OnInit} from '@angular/core';
import {FormService} from "../../../../../services/form.service";
import {UiUtilService} from "../../../../../services/ui-util.service";





@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less']
})
export class SectionComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;


  constructor(private formService:FormService, private uiUtilService:UiUtilService) {
    this.formService = formService;
    this.uiUtilService = uiUtilService;
  }

  ngOnInit() {
    console.log('section component', this.field);
  }



}
