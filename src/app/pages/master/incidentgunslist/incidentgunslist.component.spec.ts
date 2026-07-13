import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentgunslistComponent } from './incidentgunslist.component';

describe('IncidentgunslistComponent', () => {
  let component: IncidentgunslistComponent;
  let fixture: ComponentFixture<IncidentgunslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentgunslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentgunslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
