import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkexpireComponent } from './linkexpire.component';

describe('LinkexpireComponent', () => {
  let component: LinkexpireComponent;
  let fixture: ComponentFixture<LinkexpireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkexpireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkexpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
