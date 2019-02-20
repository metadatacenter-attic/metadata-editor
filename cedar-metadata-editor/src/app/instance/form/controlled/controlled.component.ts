import {Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {ControlledTermService} from '../../_service/controlled-terms.service';
import {Post} from '../../_models/post';
import {HttpClient} from "@angular/common/http";

import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';


@Component({
  selector: 'controlled',
  templateUrl: './controlled.component.html',
  styleUrls: ['./controlled.component.less']
})
export class ControlledComponent implements OnInit {

  myControl = new FormControl();
  allPosts: Post[];
  autoCompleteList: any[];
  ct: ControlledTermService;
  searchOption = [];
  selectable = true;
  removable = true;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();
  @Input() group: FormGroup;


  constructor(ct: ControlledTermService) {
    this.ct = ct;
  }

  ngOnInit() {
    // get all the post
    this.ct.getPosts().subscribe(posts => {
      this.allPosts = posts
    });

    // when user types something in input, the value changes will come through this
    this.myControl.valueChanges.subscribe(userInput => {
      let categoryList = this.filterCategoryList(userInput);
      this.autoCompleteList = categoryList;
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('selected', event.option.value);
    this.searchOption.push(event.option.value);
    this.autocompleteInput.nativeElement.value = '';
    this.autocompleteInput.nativeElement.focus();
    this.myControl.setValue(null);
    this.onSelectedOption.emit(this.searchOption)
  }

  // TODO set initial value
  setValue(value: any[]) {


    const v = {
        body: "est rerum tempore vitae↵sequi sint nihil reprehenderit dolor beatae ea dolores neque↵fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis↵qui aperiam non debitis possimus qui neque nisi nulla",
        id: 2,
        title: "qui est esse",
        userId: 1
      };

    setTimeout(() => {
      this.searchOption.push(v);
      //this.autocompleteInput.nativeElement.value = '';
      //this.autocompleteInput.nativeElement.focus();
      this.myControl.setValue(null);
      this.onSelectedOption.emit(this.searchOption)
      console.log('setValue', this.searchOption, this.myControl.value);
    }, 0);

  }
    // filter the data by the search string
    filterCategoryList(val)
    {
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

    // after you clicked an autosuggest option, this function will show the field you want to show in input
    displayFn(post: Post) {
      let k = post ? post.title : post;
      return k;
    }

    // add a new selection
    filterPostList(event)
    {
      console.log('filterPostList', event);
      var posts = event.source.value;
      if (!posts) {
        this.searchOption = []
      } else {

        this.searchOption.push(posts);
        this.onSelectedOption.emit(this.searchOption)
      }
      this.focusOnPlaceInput();
    }

    // remove an option from the selected list
    removeOption(option)
    {
      console.log('removeOption', option, this.searchOption);
      let index = this.searchOption.indexOf(option);
      if (index >= 0)
        this.searchOption.splice(index, 1);
      this.focusOnPlaceInput();

      this.onSelectedOption.emit(this.searchOption)
    }

    // focus the input field and remove any unwanted text.
    focusOnPlaceInput()
    {
      this.autocompleteInput.nativeElement.focus();
      this.autocompleteInput.nativeElement.value = '';
    }


  }
