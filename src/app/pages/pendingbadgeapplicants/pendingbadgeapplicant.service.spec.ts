import { TestBed } from '@angular/core/testing';

import { PendingbadgeapplicantService } from './pendingbadgeapplicant.service';

describe('PendingbadgeapplicantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PendingbadgeapplicantService = TestBed.get(PendingbadgeapplicantService);
    expect(service).toBeTruthy();
  });
});
