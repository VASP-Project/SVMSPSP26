import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharpObjectEditComponent } from './sharp-object-edit.component';

describe('SharpObjectEditComponent', () => {
  let component: SharpObjectEditComponent;
  let fixture: ComponentFixture<SharpObjectEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharpObjectEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharpObjectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
