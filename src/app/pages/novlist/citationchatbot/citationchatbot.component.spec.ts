import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationchatbotComponent } from './citationchatbot.component';

describe('CitationchatbotComponent', () => {
  let component: CitationchatbotComponent;
  let fixture: ComponentFixture<CitationchatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitationchatbotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitationchatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
