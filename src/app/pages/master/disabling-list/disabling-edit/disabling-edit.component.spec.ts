import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisablingEditComponent } from './disabling-edit.component';

describe('DisablingEditComponent', () => {
  let component: DisablingEditComponent;
  let fixture: ComponentFixture<DisablingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisablingEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisablingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
