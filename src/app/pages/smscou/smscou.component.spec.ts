import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmscouComponent } from './smscou.component';

describe('SmscouComponent', () => {
  let component: SmscouComponent;
  let fixture: ComponentFixture<SmscouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmscouComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmscouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
