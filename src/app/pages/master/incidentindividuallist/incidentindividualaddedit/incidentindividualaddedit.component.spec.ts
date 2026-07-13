import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentindividualaddeditComponent } from './incidentindividualaddedit.component';

describe('IncidentindividualaddeditComponent', () => {
  let component: IncidentindividualaddeditComponent;
  let fixture: ComponentFixture<IncidentindividualaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentindividualaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentindividualaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
