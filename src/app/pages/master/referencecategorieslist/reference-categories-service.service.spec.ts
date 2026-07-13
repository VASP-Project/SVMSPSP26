import { TestBed } from '@angular/core/testing';

import { ReferenceCategoriesServiceService } from './reference-categories-service.service';

describe('ReferenceCategoriesServiceService', () => {
  let service: ReferenceCategoriesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceCategoriesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
