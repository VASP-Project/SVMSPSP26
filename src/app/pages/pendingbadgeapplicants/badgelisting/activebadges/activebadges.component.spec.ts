import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivebadgesComponent } from './activebadges.component';

describe('ActivebadgesComponent', () => {
  let component: ActivebadgesComponent;
  let fixture: ComponentFixture<ActivebadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivebadgesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivebadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
