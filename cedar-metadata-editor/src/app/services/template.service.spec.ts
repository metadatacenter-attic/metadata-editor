import { TestBed } from '@angular/core/testing';

import { TemplateOldService } from './template.service';

describe('TemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemplateOldService = TestBed.get(TemplateOldService);
    expect(service).toBeTruthy();
  });
});
