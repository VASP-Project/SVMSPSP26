import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBadgeDataComponent } from './pending-badge-data.component';

describe('PendingBadgeDataComponent', () => {
  let component: PendingBadgeDataComponent;
  let fixture: ComponentFixture<PendingBadgeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingBadgeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBadgeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
