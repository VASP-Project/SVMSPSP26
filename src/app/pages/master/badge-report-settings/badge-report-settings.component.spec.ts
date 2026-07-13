import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeReportSettingsComponent } from './badge-report-settings.component';

describe('BadgeReportSettingsComponent', () => {
  let component: BadgeReportSettingsComponent;
  let fixture: ComponentFixture<BadgeReportSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeReportSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeReportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
