import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';

import {ControlledTermService} from '../../services/controlled-terms.service';
import {Post} from '../../models/post';
import {debounceTime, finalize} from "rxjs/operators";
import {tap} from "rxjs/internal/operators/tap";
import {switchMap} from "rxjs/internal/operators";
import {forkJoin} from 'rxjs';


@Component({
  selector: 'controlled',
  templateUrl: './controlled.component.html',
  styleUrls: ['./controlled.component.less']
})
export class ControlledComponent implements OnInit {

  allPosts: Post[];
  selectable = true;
  removable = true;
  isLoading = false;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @ViewChild('chipList') chipList: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  @Output() onRemovedOption = new EventEmitter();
  @Input() group: FormGroup;
  @Input() controlledGroup: FormGroup;
  @Input() classLoader: any;
  @Input() valueConstraints: any;


  constructor(private ct: ControlledTermService, private fb: FormBuilder) {
  }

  ngOnInit() {
    // when user types something in input, the value changes will come through this
    this.controlledGroup.get('search').valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(() =>
        forkJoin(
          this.ct.getPosts(this.controlledGroup.get('search').value, this.classLoader, this.valueConstraints)
        ).pipe(
          finalize(() => this.isLoading = false),
        )
      )
    ).subscribe(posts => {

      // still need to filter on the search term because valueSets don't filter
      let term = this.controlledGroup.get('search').value.toLowerCase();
      let hasSearchTerm = function(element, index, array) {
        return ( element.prefLabel.toLowerCase().indexOf(term) >= 0);
      };

      this.allPosts = [];
      for (let i = 0; i < posts.length; i++) {
        this.allPosts = this.allPosts.concat(posts[i]['collection']);
      }

      // and still need to filter and sort
      this.allPosts = this.allPosts.filter(hasSearchTerm).sort((leftSide,rightSide):number => {
        if (leftSide.prefLabel < rightSide.prefLabel) return -1;
        if (leftSide.prefLabel > rightSide.prefLabel) return 1;
        return 0;
      });

    });
  }

  // after you clicked an autosuggest option, this function will show the field you want to show in input
  displayFn(post: Post) {
    if (post) {
      return post.prefLabel;
    }
  }

  // add chips
  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      const chips = this.controlledGroup.get('chips') as FormArray;
      chips.push(this.fb.control(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // chip selection changed
  changed(event: MatAutocompleteSelectedEvent) {
  }

  // chip was removed
  remove(index: number): void {
    const chips = this.controlledGroup.get('chips') as FormArray;
    const ids = this.controlledGroup.get('ids') as FormArray;

    if (index >= 0) {
      chips.removeAt(index);
      ids.removeAt(index);
    }
    this.onRemovedOption.emit(index);
  }

  // chip was selected
  selected(event: MatAutocompleteSelectedEvent, value, label): void {
    this.autocompleteInput.nativeElement.value = '';
    this.autocompleteInput.nativeElement.focus();

    const chips = this.controlledGroup.get('chips') as FormArray;
    chips.push(this.fb.control(label.trim()));
    const ids = this.controlledGroup.get('ids') as FormArray;
    ids.push(this.fb.control(value.toString().trim()));

    // notify the parent component of the selection
    this.onSelectedOption.emit(event.option.value);
    this.controlledGroup.get('search').setValue('');
  }

  // filter the data by the search string
  filterCategoryList(val) {
    var categoryList = []
    if (typeof val != "string") {
      return [];
    }
    if (val === '' || val === null) {
      return [];
    }
    return val ? this.allPosts.filter(s => s.title.toLowerCase().indexOf(val.toLowerCase()) != -1)
      : this.allPosts;
  }


  // focus the input field and remove any unwanted text.
  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }
}
