import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionaireSecurityComponent } from './concessionaire-security.component';

describe('ConcessionaireSecurityComponent', () => {
  let component: ConcessionaireSecurityComponent;
  let fixture: ComponentFixture<ConcessionaireSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionaireSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionaireSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
