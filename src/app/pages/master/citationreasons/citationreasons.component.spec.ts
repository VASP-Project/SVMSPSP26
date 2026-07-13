import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationreasonsComponent } from './citationreasons.component';

describe('CitationreasonsComponent', () => {
  let component: CitationreasonsComponent;
  let fixture: ComponentFixture<CitationreasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitationreasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationreasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
