import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgelistingauthComponent } from './badgelistingauth.component';

describe('BadgelistingauthComponent', () => {
  let component: BadgelistingauthComponent;
  let fixture: ComponentFixture<BadgelistingauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgelistingauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgelistingauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
