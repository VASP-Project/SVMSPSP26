import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentreportComponent } from './incidentreport.component';

describe('IncidentreportComponent', () => {
  let component: IncidentreportComponent;
  let fixture: ComponentFixture<IncidentreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
