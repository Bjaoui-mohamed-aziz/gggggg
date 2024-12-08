import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DossierAddComponent } from './dossier-add.component';

describe('DossierAddComponent', () => {
  let component: DossierAddComponent;
  let fixture: ComponentFixture<DossierAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DossierAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DossierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
