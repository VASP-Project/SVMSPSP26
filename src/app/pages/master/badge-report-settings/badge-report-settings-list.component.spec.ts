import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeReportSettingsListComponent } from './badge-report-settings-list.component';

describe('BadgeReportSettingsListComponent', () => {
  let component: BadgeReportSettingsListComponent;
  let fixture: ComponentFixture<BadgeReportSettingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeReportSettingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeReportSettingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
