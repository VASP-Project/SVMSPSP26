import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentreportaddeditComponent } from './incidentreportaddedit.component';

describe('IncidentreportaddeditComponent', () => {
  let component: IncidentreportaddeditComponent;
  let fixture: ComponentFixture<IncidentreportaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentreportaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentreportaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
