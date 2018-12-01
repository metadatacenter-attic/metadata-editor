import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;

  constructor() { }

  ngOnInit() {
  }

}
