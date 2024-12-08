import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticDetailsComponent } from './diagnostic-details.component';

describe('DiagnosticDetailsComponent', () => {
  let component: DiagnosticDetailsComponent;
  let fixture: ComponentFixture<DiagnosticDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagnosticDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
