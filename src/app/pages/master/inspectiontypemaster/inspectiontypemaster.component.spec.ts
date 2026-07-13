import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectiontypemasterComponent } from './inspectiontypemaster.component';

describe('InspectiontypemasterComponent', () => {
  let component: InspectiontypemasterComponent;
  let fixture: ComponentFixture<InspectiontypemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectiontypemasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectiontypemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
