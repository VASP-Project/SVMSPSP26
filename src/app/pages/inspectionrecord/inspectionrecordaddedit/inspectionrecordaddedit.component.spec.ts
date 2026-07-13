import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionrecordaddeditComponent } from './inspectionrecordaddedit.component';

describe('InspectionrecordaddeditComponent', () => {
  let component: InspectionrecordaddeditComponent;
  let fixture: ComponentFixture<InspectionrecordaddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionrecordaddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionrecordaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
