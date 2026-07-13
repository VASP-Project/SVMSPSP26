import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceguideeditComponent } from './referenceguideedit.component';

describe('ReferenceguideeditComponent', () => {
  let component: ReferenceguideeditComponent;
  let fixture: ComponentFixture<ReferenceguideeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceguideeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceguideeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
