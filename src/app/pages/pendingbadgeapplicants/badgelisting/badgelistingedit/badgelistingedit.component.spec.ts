import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgelistingeditComponent } from './badgelistingedit.component';

describe('BadgelistingeditComponent', () => {
  let component: BadgelistingeditComponent;
  let fixture: ComponentFixture<BadgelistingeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgelistingeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgelistingeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
