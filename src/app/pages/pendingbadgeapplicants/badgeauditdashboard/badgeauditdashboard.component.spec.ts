import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeauditdashboardComponent } from './badgeauditdashboard.component';

describe('BadgeauditdashboardComponent', () => {
  let component: BadgeauditdashboardComponent;
  let fixture: ComponentFixture<BadgeauditdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeauditdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeauditdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
