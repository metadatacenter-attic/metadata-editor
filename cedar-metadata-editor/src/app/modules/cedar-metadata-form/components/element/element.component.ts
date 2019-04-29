import {Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core'
import {FormGroup, FormArray} from '@angular/forms';
import {Subscription} from "rxjs";
import {ElementService} from "./service/element.service";
import {FileNode} from "../../models/file-node";
import {UiService} from "../../../../services/ui/ui.service";


@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.less'],
  providers: [ElementService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent {


  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  @Input() formGroup: FormGroup;


  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService) {
  }

  ngOnInit() {
    if (this.parentGroup) {
      this.parentGroup.addControl(this.node.key, this.formGroup);
    }

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

}
