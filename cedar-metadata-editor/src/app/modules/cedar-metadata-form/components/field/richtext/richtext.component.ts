import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.less']
})
export class RichtextComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;

  constructor() { }

  ngOnInit() {
  }

}
