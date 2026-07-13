import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenttypesComponent } from './incidenttypes.component';

describe('IncidenttypesComponent', () => {
  let component: IncidenttypesComponent;
  let fixture: ComponentFixture<IncidenttypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenttypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenttypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
