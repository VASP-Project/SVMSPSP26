import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerAddEditComponent } from './scheduler-add-edit.component';

describe('SchedulerAddEditComponent', () => {
  let component: SchedulerAddEditComponent;
  let fixture: ComponentFixture<SchedulerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulerAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
