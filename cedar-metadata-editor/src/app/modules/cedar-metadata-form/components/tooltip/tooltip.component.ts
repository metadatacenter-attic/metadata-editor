import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-tooltip',
  styleUrls: ['./tooltip.component.less'],
  templateUrl: './tooltip.component.html',
  // animations: [
  //   trigger('tooltip', [
  //     transition(':enter', [
  //       style({opacity: 0}),
  //       animate(300, style({opacity: 1})),
  //     ]),
  //     transition(':leave', [
  //       animate(300, style({opacity: 0})),
  //     ]),
  //   ]),
  // ],
})
export class TooltipComponent {
  @Input() type = 'success';
  newType = 'old type';

  constructor(private cd: ChangeDetectorRef) {
    console.log('tooltip component constructor', this.type);

  }

  show(t: string) {
    console.log('show component ', t, this.newType);
    this.newType = t;
    this.cd.markForCheck();
  }

}
