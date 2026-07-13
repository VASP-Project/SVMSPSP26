import { TestBed } from '@angular/core/testing';

import { BadgelistingService } from './badgelisting.service';

describe('BadgelistingService', () => {
  let service: BadgelistingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgelistingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
