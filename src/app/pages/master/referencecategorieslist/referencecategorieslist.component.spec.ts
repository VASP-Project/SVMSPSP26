import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencecategorieslistComponent } from './referencecategorieslist.component';

describe('ReferencecategorieslistComponent', () => {
  let component: ReferencecategorieslistComponent;
  let fixture: ComponentFixture<ReferencecategorieslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencecategorieslistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencecategorieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
