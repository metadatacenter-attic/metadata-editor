import { TestBed } from '@angular/core/testing';

import { FieldTypeService } from './field-type.service';

describe('FieldTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FieldTypeService = TestBed.get(FieldTypeService);
    expect(service).toBeTruthy();
  });
});
