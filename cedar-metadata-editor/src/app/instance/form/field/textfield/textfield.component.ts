import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-textfield',
  templateUrl: './textfield.component.html',
  styleUrls: ['./textfield.component.less']
})
export class TextfieldComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;


  constructor() { }

  ngOnInit() {
  }

}
