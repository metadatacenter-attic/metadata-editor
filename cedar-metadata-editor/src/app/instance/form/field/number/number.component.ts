import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.less']
})
export class NumberComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;


  constructor() { }

  ngOnInit() {
  }

}
