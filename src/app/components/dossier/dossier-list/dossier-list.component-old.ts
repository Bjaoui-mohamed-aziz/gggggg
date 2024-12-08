// import { DiagnosticService } from './../../../services/dossier-service/diag-service/diagnostic.service';
// import { Component, OnInit } from '@angular/core';
// import { tap } from 'rxjs';
// import { CommonModule, formatDate } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Dossier } from '../../../models/dossier.model';
// import { DossierService } from '../../../services/dossier-service/dossier.service';
// import { Diagnostic } from '../../../models/diagnostic.model';


// @Component({
//   selector: 'app-dossier-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './dossier-list.component.html',
//   styleUrl: './dossier-list.component.css'
// })


// export class DossierListComponent implements OnInit {

//   dossiers?: Dossier[];
//   diagnostics?: Diagnostic[]
//   currentDossier: Dossier = new Dossier();
//   searchCIN = '';
//   showForm = false;
//   showRow = false;
//   currentDiagnostic: Diagnostic = new Diagnostic;


//   constructor(
//     private dossierService: DossierService, 
//     private diagnosticService: DiagnosticService,
//     private router: Router) { }

//   ngOnInit() {
//     this.getListDossiers();
//     this.getListDiagnostics();
//   }


//   // ------ List Dossiers ------ 

//   getListDossiers() {
//     this.dossierService.getAll().pipe(
//       tap((data: Dossier[]) => {
//         this.dossiers = data;
//         console.log('Dossiers loaded:', this.dossiers);
//         // this.currentDossier = this.dossiers[0]
//         // this.showForm = true;
//         // this.showRow = true;
//       })
//     ).subscribe();

//   }

//   getListDiagnostics() {
//     this.diagnosticService.getAll().pipe(
//       tap((data: Diagnostic[]) => {
//         this.diagnostics = data;
//         console.log('Diagnostics loaded:', this.diagnostics);
//       })
//     ).subscribe();

//   }



//   getPatientDossiers() {
//     if (!this.searchCIN) {
//       this.getListDossiers();
//     }
//     const dos = this.dossiers?.filter(d => d.patient?.cin == this.searchCIN);
//     this.dossiers = dos;
//     console.log(dos);

//   }

  

//   // ------ Add Dossier ------ 

//   goCreatePage() {
//     this.router.navigate(['/add-dossier/']);
//   }

//   goCreateDiagPage(){
//     this.router.navigate(['/add-diag/']);
//   }


//   // ------ Fetch Dossier ------ 

//   getDossier(id: string) {
//     this.dossierService.get(id).subscribe({
//       next: (data: Dossier) => {
//         this.currentDossier = data;
//         console.log(data);
//       },
//       error: (e) => console.log(e)
//     })
//   }

//   goDossier(id: any) {
//     this.router.navigate(['/dossiers/', id]);
//   }

  
//   // ------ Fetch Diagnostic ------ 

//   getDiagnostic(id: string) {
//     this.diagnosticService.get(id).subscribe({
//       next: (data: Diagnostic) => {
//         this.currentDiagnostic = data;
//         console.log(data);
//       },
//       error: (e) => console.log(e)
//     })
//   }

//   getDossierDiagnostics() {
//     this.diagnostics = this.currentDossier.listDiagnostics;
//     console.log(this.diagnostics);
//   }



//   // ------- Get / Set Dossier ------- 

//   setCurrDossier(dossier: any) {
//     this.currentDossier = dossier;
//     this.getDossierDiagnostics()

//   }

//   getCurrDossier() {
//     console.log(this.currentDossier.listDiagnostics);
//     return this.currentDossier;

//   }

  

//   // Update diagnostic

//   setCurrDiagnostic(diagno: any) {
//     this.currentDiagnostic = diagno;

//   }

//   getCurrDiagnostic() {
//     return this.currentDiagnostic;

//   }

//   updateDiagnostic(id: any) {
//     if (!id) {
//       console.error("Diagnostic ID is missing");
//       return;
//     }
//     if (!this.diagnostics) {
//       console.error("Diagnostic list is undefined");
//       return;
//     }
//     const diagnoToUpdate = this.diagnostics.find(d => d.id == id)
//     const data = {
//       id: diagnoToUpdate?.id,
//       diagnostic: diagnoToUpdate?.diagnostic,
//       dateCreation: diagnoToUpdate?.dateCreation,
//     }
//     const index = this.diagnostics.findIndex(diagno => diagno.id === id);

//     this.diagnosticService.update(id, data).subscribe({
//       next: (data: Diagnostic) => {
//         if (this.diagnostics) {
//           this.diagnostics[index] = data;
//           console.log("Updated diagno: ", data);
//         }
//       },
//       error: (e) => console.log(e)
//     })
//   }



//   // ------- Delete Dossier ------- 

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

  
//   // ------- Delete Diagnostic ------- 
//   deleteDiagnostic(id: any){
//     if (!this.diagnostics) {
//       console.error("Diagnostics list is undefined");
//       return;
//     }
//     const index = this.diagnostics.findIndex(diagnostic => diagnostic.id === id);
    
//     this.diagnosticService.delete(this.diagnostics[index].id).subscribe({
//       next: (data) => {
//         console.log("after deletion: ", data);
//         // this.getListDiagnostics();
//         this.getDossierDiagnostics();

//       },
//       error: (e) => console.log("Erreur: ", e)
//     });
//   }



//   // ------- Reset Dossier -------

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


//   // ------- Reset Diagnostic -------

//   resetDiagnostic(diagno: Diagnostic) {
//     this.getListDiagnostics();
//     if (!this.diagnostics) {
//       console.error("Diagnostics list is undefined");
//       return;
//     }

//     // const index = this.diagnostics.findIndex(d => d.id === diagno.id);
//     // this.currentDiagnostic = this.diagnostics[index];
    
//     this.showForm = !this.showForm;
//     this.getListDossiers();
//   }



//   // ------- Format the Date ------- 

//   date(d: Date | undefined) {
//     if (!d) return 'Date non disponible';
//     return formatDate(d, 'dd MMM, yyyy', 'en-ES');
//   }



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


//   // ------- Form Visibility -------

//   changeState() {
//     this.showRow = !this.showRow;

//   }

//   hideForm() {
//     if (this.showForm) {
//       this.showForm = !this.showForm;
//     }
//   }

//   hideRow() {
//     if (this.showRow) {
//       this.showRow = !this.showRow;
//     }
//   }




// }
