import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisablingListComponent } from './disabling-list.component';

describe('DisablingListComponent', () => {
  let component: DisablingListComponent;
  let fixture: ComponentFixture<DisablingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisablingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisablingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
