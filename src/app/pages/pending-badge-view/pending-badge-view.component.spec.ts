import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBadgeViewComponent } from './pending-badge-view.component';

describe('PendingBadgeViewComponent', () => {
  let component: PendingBadgeViewComponent;
  let fixture: ComponentFixture<PendingBadgeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingBadgeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBadgeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
