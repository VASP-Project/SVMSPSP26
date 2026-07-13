import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionssecurityauditComponent } from './concessionssecurityaudit.component';

describe('ConcessionssecurityauditComponent', () => {
  let component: ConcessionssecurityauditComponent;
  let fixture: ComponentFixture<ConcessionssecurityauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionssecurityauditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionssecurityauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
