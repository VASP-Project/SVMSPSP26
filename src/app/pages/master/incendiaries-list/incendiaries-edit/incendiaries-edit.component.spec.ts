import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncendiariesEditComponent } from './incendiaries-edit.component';

describe('IncendiariesEditComponent', () => {
  let component: IncendiariesEditComponent;
  let fixture: ComponentFixture<IncendiariesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncendiariesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncendiariesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
