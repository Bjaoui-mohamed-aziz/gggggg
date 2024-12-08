// 'dossier/:id'


import { PatientService } from './../../../services/patient-service/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Diagnostic } from '../../../models/diagnostic.model';
import { DiagnosticService } from '../../../services/dossier-service/diag-service/diagnostic.service';
import { Patient } from '../../../models/dossier.model';


@Component({
  selector: 'app-dossier-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dossier-details.component.html',
  styleUrl: './dossier-details.component.css'
})


export class DossierDetailsComponent implements OnInit{
  
  dossier?: Diagnostic[]
  patient: Patient = new Patient();
  currentDiagnostic: Diagnostic = new Diagnostic;
  loading: boolean = true;
  showForm = false;
  showRow = false;
  showModal?: boolean;

  constructor(  private diagnosticService: DiagnosticService,
                private PatientService: PatientService,
                private route: ActivatedRoute, 
                private router: Router) {}


  ngOnInit() {
    const patientID = this.route.snapshot.params["id"];
    
    this.getPatient(patientID);
    this.getListDiagnostics(patientID);

    this.loading = false;
  }



  // ------- Display Patient ------- 

  getPatient(id: any){
    this.PatientService.get(id).subscribe({
              next: (data: Patient) => {
                this.patient = data;
                console.log(data);
              },
              error: (e) => console.log(e)
            })
  }


  goCreateDiagPage(){
    this.router.navigate(['/add-diag/']);
  }



  getListDiagnostics(patientID: any): void {
      this.diagnosticService.findByPatient(patientID).subscribe(
          (data: Diagnostic[]) => {
              this.dossier = data;
          },
          (error) => {
              console.error('Error fetching dossier:', error);
          }
      );
  }



  setCurrDiagnostic(diagno: any) {
    this.currentDiagnostic = diagno;

  }
  
  updateDiagnostic(id: any) {
    if (!id) {
      console.error("Diagnostic ID is missing");
      return;
    }
    if (!this.dossier) {
      console.error("Dossier is empty");
      return;
    }
    const diagnoToUpdate = this.dossier.find(d => d.id == id)
    const data = {
      id: diagnoToUpdate?.id,
      diagnostic: diagnoToUpdate?.diagnostic,
      dateCreation: diagnoToUpdate?.dateCreation,
      patient: this.patient
    }
    const index = this.dossier.findIndex(diagno => diagno.id === id);

    this.diagnosticService.update(id, data).subscribe({
      next: (data: Diagnostic) => {
        if (this.dossier) {
          this.dossier[index] = data;
          console.log("Updated diagno: ", data);
        }
      },
      error: (e) => console.log(e)
    })
  }

    // ------- Reset Diagnostic -------

    resetDiagnostic(diagno: Diagnostic) {
    this.getListDiagnostics(this.patient.id);
    if (!this.dossier) {
        console.error("Dossier empty");
        return;
    }

    
    this.showForm = !this.showForm;
    this.getListDiagnostics(this.patient.id);
    }



    // ------- Delete Diagnostic ------- 
    deleteDiagnostic(id: any){
    if (!this.dossier) {
        console.error("Dossier is empty");
        return;
    }
    const index = this.dossier.findIndex(diagnostic => diagnostic.id === id);
    
    this.diagnosticService.delete(this.dossier[index].id).subscribe({
        next: (data) => {
        console.log("after deletion: ", data);
        this.getListDiagnostics(this.patient.id);

        },
        error: (e) => console.log("Erreur: ", e)
    });
    }



// ------- Format the Date ------- 

    date(d: Date | undefined) {
    if (!d) return 'Date non disponible';
    return "Le " + formatDate(d, 'dd MMM, yyyy', 'en-ES') + " à " + formatDate(d, 'HH:mm', 'en-ES') + "H";
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


  // // ------- Delete Dossier ------- 

// deleteDossier(){
//   this.dossierService.delete(this.dossier.id).subscribe({
//     next: (data) => {
//       console.log(data);
//       this.router.navigate(['/dossiers']);

//     },
//     error: (e) => console.log(e)
//   });
// }


 // ------- Update Dossier ------- 

//   updateDossier(){
//     if (!this.dossier?.id) {
//       console.error("Dossier ID is missing");
//       return;
//     }
//     const data = {
//       id: this.dossier.id,
//       diagnostic: this.dossier.listDiagnostics,
//       dateCreation: this.dossier.dateCreation,
//       patient: this.dossier.patient,
//     }
  
//     this.dossierService.update(this.dossier.id, data).subscribe({
//       next: (data: Dossier) => {
//         this.dossier = data;
//         console.log(data);
//       },
//       error: (e) => console.log(e)
//     })
//   }


// //Bootstrap Modal Open event
//   show(){
//     this.showModal = true;
//   }

//   //Bootstrap Modal Close event
//   hide(){
//     this.showModal = false;
//   }


}
