import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionaireauditlogComponent } from './concessionaireauditlog.component';

describe('ConcessionaireauditlogComponent', () => {
  let component: ConcessionaireauditlogComponent;
  let fixture: ComponentFixture<ConcessionaireauditlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionaireauditlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionaireauditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
