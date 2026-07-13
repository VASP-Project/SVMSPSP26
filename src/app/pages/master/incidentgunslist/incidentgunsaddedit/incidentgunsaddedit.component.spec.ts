import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentgunsaddeditComponent } from './incidentgunsaddedit.component';

describe('IncidentgunsaddeditComponent', () => {
  let component: IncidentgunsaddeditComponent;
  let fixture: ComponentFixture<IncidentgunsaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentgunsaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentgunsaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
