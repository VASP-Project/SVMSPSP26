import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeauditexcelComponent } from './badgeauditexcel.component';

describe('BadgeauditexcelComponent', () => {
  let component: BadgeauditexcelComponent;
  let fixture: ComponentFixture<BadgeauditexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgeauditexcelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeauditexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
