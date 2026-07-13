import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeverificationComponent } from './badgeverification.component';

describe('BadgeverificationComponent', () => {
  let component: BadgeverificationComponent;
  let fixture: ComponentFixture<BadgeverificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeverificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
