import { TestBed } from '@angular/core/testing';

import { ReferenceguidesService } from './referenceguides.service';

describe('ReferenceguidesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceguidesService = TestBed.get(ReferenceguidesService);
    expect(service).toBeTruthy();
  });
});
