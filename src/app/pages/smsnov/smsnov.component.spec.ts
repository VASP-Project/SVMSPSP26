import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsnovComponent } from './smsnov.component';

describe('SmsnovComponent', () => {
  let component: SmsnovComponent;
  let fixture: ComponentFixture<SmsnovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsnovComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsnovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
