import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less']
})
export class RadioComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;


  constructor() { }

  ngOnInit() {
  }

}
