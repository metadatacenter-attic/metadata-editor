import { Component , OnInit} from '@angular/core';

@Component ({
  selector :'app-form',
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {
  title: string;

  constructor() {}

  ngOnInit() {
    this.title = 'Metadata Editor';
  }
}
