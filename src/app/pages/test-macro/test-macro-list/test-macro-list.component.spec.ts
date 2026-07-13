import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMacroListComponent } from './test-macro-list.component';

describe('TestMacroListComponent', () => {
  let component: TestMacroListComponent;
  let fixture: ComponentFixture<TestMacroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMacroListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMacroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
