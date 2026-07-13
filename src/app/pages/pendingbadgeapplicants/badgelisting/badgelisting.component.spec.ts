import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgelistingComponent } from './badgelisting.component';

describe('BadgelistingComponent', () => {
  let component: BadgelistingComponent;
  let fixture: ComponentFixture<BadgelistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BadgelistingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgelistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
