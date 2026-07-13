import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentexplosiveslistComponent } from './incidentexplosiveslist.component';

describe('IncidentexplosiveslistComponent', () => {
  let component: IncidentexplosiveslistComponent;
  let fixture: ComponentFixture<IncidentexplosiveslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentexplosiveslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentexplosiveslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
