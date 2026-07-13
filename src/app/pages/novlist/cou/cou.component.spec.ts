import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouComponent } from './cou.component';

describe('CouComponent', () => {
  let component: CouComponent;
  let fixture: ComponentFixture<CouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
