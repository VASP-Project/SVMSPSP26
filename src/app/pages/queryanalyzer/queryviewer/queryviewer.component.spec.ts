import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryviewerComponent } from './queryviewer.component';

describe('QueryviewerComponent', () => {
  let component: QueryviewerComponent;
  let fixture: ComponentFixture<QueryviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
