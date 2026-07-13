import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouviewComponent } from './couview.component';

describe('CouviewComponent', () => {
  let component: CouviewComponent;
  let fixture: ComponentFixture<CouviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
