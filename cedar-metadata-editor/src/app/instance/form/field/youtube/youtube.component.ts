import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.less']
})
export class YoutubeComponent implements OnInit {
  @Input('field') field: object;
  @Input('parent') parent: object;
  @Input('key') key: object;

  constructor() { }

  ngOnInit() {
  }

}
