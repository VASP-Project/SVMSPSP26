import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionmastereditComponent } from './inspectionmasteredit.component';

describe('InspectionmastereditComponent', () => {
  let component: InspectionmastereditComponent;
  let fixture: ComponentFixture<InspectionmastereditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionmastereditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionmastereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
