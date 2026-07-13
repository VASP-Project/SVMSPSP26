import { TestBed } from '@angular/core/testing';

import { InspectionrecordService } from './inspectionrecord.service';

describe('InspectionrecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InspectionrecordService = TestBed.get(InspectionrecordService);
    expect(service).toBeTruthy();
  });
});
