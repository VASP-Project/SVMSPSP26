import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionmethodaddeditComponent } from './detectionmethodaddedit.component';

describe('DetectionmethodaddeditComponent', () => {
  let component: DetectionmethodaddeditComponent;
  let fixture: ComponentFixture<DetectionmethodaddeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectionmethodaddeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectionmethodaddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
