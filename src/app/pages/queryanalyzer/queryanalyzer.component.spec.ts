import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryanalyzerComponent } from './queryanalyzer.component';

describe('QueryanalyzerComponent', () => {
  let component: QueryanalyzerComponent;
  let fixture: ComponentFixture<QueryanalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryanalyzerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryanalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
