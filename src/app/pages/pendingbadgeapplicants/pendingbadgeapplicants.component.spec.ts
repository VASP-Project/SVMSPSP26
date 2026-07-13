import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingbadgeapplicantsComponent } from './pendingbadgeapplicants.component';

describe('PendingbadgeapplicantsComponent', () => {
  let component: PendingbadgeapplicantsComponent;
  let fixture: ComponentFixture<PendingbadgeapplicantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingbadgeapplicantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingbadgeapplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
