import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenttypeaddeditComponent } from './incidenttypeaddedit.component';

describe('IncidenttypeaddeditComponent', () => {
  let component: IncidenttypeaddeditComponent;
  let fixture: ComponentFixture<IncidenttypeaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidenttypeaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidenttypeaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
