import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierDetailsComponent } from './dossier-details.component';

describe('DossierDetailsComponent', () => {
  let component: DossierDetailsComponent;
  let fixture: ComponentFixture<DossierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
