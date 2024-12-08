// 'add-diag'


import { DiagnosticService } from './../../../services/dossier-service/diag-service/diagnostic.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient-service/patient.service';
import { Patient } from '../../../models/dossier.model';


@Component({
  selector: 'app-diagnostic-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnostic-add.component.html',
  styleUrl: './diagnostic-add.component.css'
})

export class DiagnosticAddComponent implements OnInit{

  patients?: Patient[];

  patient: Patient = {
    listDiagnostics: []
  }

  diagno = {
    diagnostic: '',
    patient: this.patient
  };
  


  constructor(
    private diagnosticService: DiagnosticService, 
      private patientService: PatientService, 
    private route: ActivatedRoute, 
    private router: Router){}


    patientId: number | null = null;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.patientId = +params['patientId']; // Extract patientId and convert it to a number
      console.log(this.patientId);
      
    });
    this.getListPatients();
    
  }

  getListPatients(){
    this.patientService.getAll().pipe(
      tap((data: Patient[] | undefined) => {
        this.patients = data;
        console.log('Patients loaded:', this.patients);
      })
    ).subscribe();
  }


  createDiagnostic() {
    const diagnoData = {
      diagnostic: this.diagno.diagnostic,
      patient: this.patient
    };

    this.diagnosticService.create(diagnoData).subscribe({
      next: (diagnoData) => {
        console.log('Diagnostic ajouté:', diagnoData);
        this.router.navigate(['/dossier/', this.patient.id]);
      },
      error: (e) => console.log('erreur: ', e)
    });
  }




}
