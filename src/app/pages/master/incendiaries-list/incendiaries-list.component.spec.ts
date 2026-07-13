import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncendiariesListComponent } from './incendiaries-list.component';

describe('IncendiariesListComponent', () => {
  let component: IncendiariesListComponent;
  let fixture: ComponentFixture<IncendiariesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncendiariesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncendiariesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
