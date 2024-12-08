// 'diagnostics/:id'


import { PatientService } from './../../../services/patient-service/patient.service';
import { Patient } from './../../../models/dossier.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiagnosticService } from '../../../services/dossier-service/diag-service/diagnostic.service';
import { Diagnostic } from '../../../models/diagnostic.model';


@Component({
  selector: 'app-diagnostic-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diagnostic-details.component.html',
  styleUrl: './diagnostic-details.component.css'
})

export class DiagnosticDetailsComponent implements OnInit{

  diagnostic: Diagnostic = new Diagnostic();
  patient?: Patient;
  loading: boolean = true;

  constructor(private diagnosticService: DiagnosticService, 
              private PatientService: PatientService,
              private route: ActivatedRoute, 
              private router: Router) {}

  ngOnInit() {
    const diagnoID = this.route.snapshot.params["id"];

    this.getDiagnostic(diagnoID);
    this.getPatient(diagnoID);

    this.loading = false;
  }

   // ------- Display Diagnostic ------- 

   getDiagnostic(id: string){
    this.diagnosticService.get(id).subscribe({
      next: (data: Diagnostic) => {
        this.diagnostic = data;
        console.log(data);
      },
      error: (e) => console.log(e)
    })
  }


  
  getPatient(diagnoID: any): void {
    this.PatientService.findByDiagnostic(diagnoID).subscribe(
        (data: Patient) => {
            this.patient = data;
        },
        (error) => {
            console.error('Error fetching dossier:', error);
        }
    );
}



  // ------- Format the Date ------- 

  date(d: Date | undefined) {
    if (!d) return 'Date non disponible';
    return "Le " + formatDate(d, 'dd MMM, yyyy', 'en-ES') + " à " + formatDate(d, 'HH:mm', 'en-ES') + "H";
  }
    

}

