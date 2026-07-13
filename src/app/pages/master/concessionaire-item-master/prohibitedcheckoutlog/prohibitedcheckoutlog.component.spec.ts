import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProhibitedcheckoutlogComponent } from './prohibitedcheckoutlog.component';

describe('ProhibitedcheckoutlogComponent', () => {
  let component: ProhibitedcheckoutlogComponent;
  let fixture: ComponentFixture<ProhibitedcheckoutlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProhibitedcheckoutlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProhibitedcheckoutlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
