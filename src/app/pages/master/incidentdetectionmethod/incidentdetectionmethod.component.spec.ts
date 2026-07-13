import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentdetectionmethodComponent } from './incidentdetectionmethod.component';

describe('IncidentdetectionmethodComponent', () => {
  let component: IncidentdetectionmethodComponent;
  let fixture: ComponentFixture<IncidentdetectionmethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentdetectionmethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentdetectionmethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
