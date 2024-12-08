import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticAddComponent } from './diagnostic-add.component';

describe('DiagnosticAddComponent', () => {
  let component: DiagnosticAddComponent;
  let fixture: ComponentFixture<DiagnosticAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
