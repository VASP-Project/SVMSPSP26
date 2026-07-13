import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgedetailsComponent } from './badgedetails.component';

describe('BadgedetailsComponent', () => {
  let component: BadgedetailsComponent;
  let fixture: ComponentFixture<BadgedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
