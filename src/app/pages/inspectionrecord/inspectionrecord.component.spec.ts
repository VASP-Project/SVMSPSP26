import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionrecordComponent } from './inspectionrecord.component';

describe('InspectionrecordComponent', () => {
  let component: InspectionrecordComponent;
  let fixture: ComponentFixture<InspectionrecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionrecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
