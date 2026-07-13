import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaddeditComponent } from './novaddedit.component';

describe('NovaddeditComponent', () => {
  let component: NovaddeditComponent;
  let fixture: ComponentFixture<NovaddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
