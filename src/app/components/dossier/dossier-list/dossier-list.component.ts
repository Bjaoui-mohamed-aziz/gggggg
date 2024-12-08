import { PatientService } from './../../../services/patient-service/patient.service';
import { DiagnosticService } from './../../../services/dossier-service/diag-service/diagnostic.service';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Diagnostic } from '../../../models/diagnostic.model';
import { Patient } from '../../../models/dossier.model';


@Component({
  selector: 'app-dossier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dossier-list.component.html',
  styleUrl: './dossier-list.component.css'
})


export class DossierListComponent implements OnInit {

  patients?: Patient[];
  diagnostics?: Diagnostic[]
  currentPatient: Patient = new Patient();

  searchCIN = '';
  showForm = false;
  showRow = false;
  currentDiagnostic: Diagnostic = new Diagnostic;


  constructor(
    private diagnosticService: DiagnosticService,
    private patientService: PatientService,
    private router: Router) { }

  ngOnInit() {

    this.getListPatients();
  }



  getListPatients() {
    this.patientService.getAll().pipe(
      tap((data: Patient[]) => {
        this.patients = data;
        console.log('Patients loaded:', this.patients);
        // this.currentDossier = this.dossiers[0]
        // this.showForm = true;
        // this.showRow = true;
      })
    ).subscribe();

  }



getListDiagnostics(patientID: any): void {
    this.diagnosticService.findByPatient(patientID).subscribe(
        (data: Diagnostic[]) => {
            this.diagnostics = data;
        },
        (error) => {
            console.error('Error fetching dossier:', error);
        }
    );
}

  

  // ------ Add Diag ------ 


  goCreateDiagPage(){
    this.router.navigate(['/add-diag/']);
  }


 
  goDossier(id: any) {
    this.router.navigate(['/dossier/', id]);
  }

  
  // ------ Fetch Diagnostic ------ 

  getDiagnostic(id: string) {
    this.diagnosticService.get(id).subscribe({
      next: (data: Diagnostic) => {
        this.currentDiagnostic = data;
        console.log(data);
      },
      error: (e) => console.log(e)
    })
  }

//   getDossierDiagnostics() {
//     this.diagnostics = this.currentDossier.listDiagnostics;
//     console.log(this.diagnostics);
//   }



  // ------- Get / Set Dossier ------- 

  setCurrPatient(patient: any) {
    this.currentPatient = patient;
  }

  getCurrPatient() {
    console.log(this.currentPatient.listDiagnostics);
    return this.currentPatient;
  }

  

  // Update diagnostic

  setCurrDiagnostic(diagno: any) {
    this.currentDiagnostic = diagno;

  }

  getCurrDiagnostic() {
    return this.currentDiagnostic;

  }


  updateDiagnostic(id: any) {
    if (!id) {
      console.error("Diagnostic ID is missing");
      return;
    }
    if (!this.diagnostics) {
      console.error("Diagnostic list is undefined");
      return;
    }
    const diagnoToUpdate = this.diagnostics.find(d => d.id == id)
    const data = {
      id: diagnoToUpdate?.id,
      diagnostic: diagnoToUpdate?.diagnostic,
      dateCreation: diagnoToUpdate?.dateCreation,
      patient: this.currentPatient
    }
    const index = this.diagnostics.findIndex(diagno => diagno.id === id);

    this.diagnosticService.update(id, data).subscribe({
      next: (data: Diagnostic) => {
        if (this.diagnostics) {
          this.diagnostics[index] = data;
          console.log("Updated diagno: ", data);

          this.hideForm();
          this.showRowF();
          this.getListPatients();
        }
      },
      error: (e) => console.log(e)
    })
  }

 // ------- Reset Diagnostic -------

  resetDiagnostic(diagno: Diagnostic) {
    this.getListDiagnostics(this.currentPatient.id);
    if (!this.diagnostics) {
      console.error("Diagnostics list is undefined");
      return;
    }

    this.hideForm();
    this.showRowF();
    this.getListPatients();
  }




  
  // ------- Delete Diagnostic ------- 

    deleteDiagnostic(id: any){
    if (!this.diagnostics) {
      console.error("Diagnostics list is undefined");
      return;
    }
    const index = this.diagnostics.findIndex(diagnostic => diagnostic.id === id);
    
    this.diagnosticService.delete(this.diagnostics[index].id).subscribe({
      next: (data) => {
        console.log("after deletion: ", data);
        this.getListDiagnostics(this.currentPatient.id);

      },
      error: (e) => console.log("Erreur: ", e)
    });
  }



 


  // ------- Format the Date ------- 

  date(d: Date | undefined) {
    if (!d) return 'Date non disponible';
    return formatDate(d, 'dd MMM, yyyy', 'en-ES');
  }




  // ------- Form Visibility -------

  changeState() {
    this.showRow = !this.showRow;
  }

  hideForm() {
    if (this.showForm) {
      this.showForm = !this.showForm;
    }
  }

  hideRow() {
    if (this.showRow) {
      this.showRow = !this.showRow;
    }
  }

  showFormF() {
    if (!this.showForm) {
      this.showForm = !this.showForm;
    }
  }

  showRowF() {
    if (!this.showRow) {
      this.showRow = !this.showRow;
    }
  }



//   previewDiag(diag: any) {
//     let preview = '';
//     let i = 0;
//     for (let index = 0; index < diag.length; index++) {
//       preview += diag[index];
//       i++;
//       if (i == 60) { break }
//     }
//     return preview + " ...";
//   }




  // ------- Reset Dossier -------

//   resetDossier(dossier: Dossier) {
//     this.getListDossiers();
//     if (!this.dossiers) {
//       console.error("Dossiers list is undefined");
//       return;
//     }

//     const index = this.dossiers.findIndex(d => d.id === dossier.id);
//     this.currentDossier = this.dossiers[index];
//     this.showForm = !this.showForm;
//   }


    // ------- Delete Dossier ------- 

//   deleteDossier(id: any) {
//     if (!this.dossiers) {
//       console.error("Dossiers list is undefined");
//       return;
//     }
//     const index = this.dossiers.findIndex(dossier => dossier.id === id);

//     this.dossierService.delete(this.dossiers[index].id).subscribe({
//       next: (data) => {
//         console.log(data);
//         this.getListDossiers();
//       },
//       error: (e) => console.log(e)
//     });
//   }



}
