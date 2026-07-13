import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentexplosiveaddeditComponent } from './incidentexplosiveaddedit.component';

describe('IncidentexplosiveaddeditComponent', () => {
  let component: IncidentexplosiveaddeditComponent;
  let fixture: ComponentFixture<IncidentexplosiveaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentexplosiveaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentexplosiveaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
