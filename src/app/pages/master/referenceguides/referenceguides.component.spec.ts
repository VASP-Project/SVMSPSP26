import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceguidesComponent } from './referenceguides.component';

describe('ReferenceguidesComponent', () => {
  let component: ReferenceguidesComponent;
  let fixture: ComponentFixture<ReferenceguidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceguidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceguidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
