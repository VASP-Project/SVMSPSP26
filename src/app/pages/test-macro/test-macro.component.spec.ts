import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMacroComponent } from './test-macro.component';

describe('TestMacroComponent', () => {
  let component: TestMacroComponent;
  let fixture: ComponentFixture<TestMacroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestMacroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMacroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
