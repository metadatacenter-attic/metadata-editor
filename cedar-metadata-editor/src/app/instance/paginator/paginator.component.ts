import {Component} from '@angular/core';
import {PageEvent} from '@angular/material';

/**
 * @title Configurable paginator
 */
@Component({
  selector: 'paginator-component',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.less']
})
  export class PaginatorComponent {
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }
}



