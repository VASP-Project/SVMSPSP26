import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharpObjectsListComponent } from './sharp-objects-list.component';

describe('SharpObjectsListComponent', () => {
  let component: SharpObjectsListComponent;
  let fixture: ComponentFixture<SharpObjectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharpObjectsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharpObjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
