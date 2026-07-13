import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovlistComponent } from './novlist.component';

describe('NovlistComponent', () => {
  let component: NovlistComponent;
  let fixture: ComponentFixture<NovlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
