import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencecategorieseditComponent } from './referencecategoriesedit.component';

describe('ReferencecategorieseditComponent', () => {
  let component: ReferencecategorieseditComponent;
  let fixture: ComponentFixture<ReferencecategorieseditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencecategorieseditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencecategorieseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
