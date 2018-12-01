import { TestBed } from '@angular/core/testing';

import { QuestionConrolService } from './question-conrol.service';

describe('QuestionConrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionConrolService = TestBed.get(QuestionConrolService);
    expect(service).toBeTruthy();
  });
});
