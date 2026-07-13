import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionrecordviewComponent } from './inspectionrecordview.component';

describe('InspectionrecordviewComponent', () => {
  let component: InspectionrecordviewComponent;
  let fixture: ComponentFixture<InspectionrecordviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionrecordviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionrecordviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
