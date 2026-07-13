import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentindividuallistComponent } from './incidentindividuallist.component';

describe('IncidentindividuallistComponent', () => {
  let component: IncidentindividuallistComponent;
  let fixture: ComponentFixture<IncidentindividuallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentindividuallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentindividuallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
