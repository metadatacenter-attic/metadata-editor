import {ChangeDetectionStrategy, Component, Input} from '@angular/core'
import {FormGroup} from '@angular/forms';
import {Subscription} from "rxjs";
import {FileNode} from "../../models/file-node";
import {UiService} from "../../../../services/ui/ui.service";


@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.less'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent {


  @Input() node: FileNode;
  @Input() parentGroup: FormGroup;
  @Input() formGroup: FormGroup;
  @Input() index: number;


  darkMode: boolean;
  private _darkModeSub: Subscription;

  constructor(private ui: UiService) {
  }

  ngOnInit() {
    console.log('ngOnInit', this.node.key, this.node.itemCount, this.node.model[this.node.key], this.parentGroup);
    if (this.parentGroup) {
      this.parentGroup.addControl(this.node.key, this.formGroup);
    }

    this._darkModeSub = this.ui.darkModeState$.subscribe(value => {
      this.darkMode = value;
    });
  }

}
