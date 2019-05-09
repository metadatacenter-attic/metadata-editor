import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValueComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: AttributeValueComponent;
  let fixture: ComponentFixture<AttributeValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
