// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormsModule } from '@angular/forms';
// import { DossierService } from '../../../services/dossier-service/dossier.service';
// import { CommonModule } from '@angular/common';
// import { tap } from 'rxjs';
// import { Router } from '@angular/router';
// import { PatientService } from '../../../services/patient-service/patient.service';
// import { Dossier, Patient } from '../../../models/dossier.model';

// @Component({
//   selector: 'app-dossier-add',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './dossier-add.component.html',
//   styleUrl: './dossier-add.component.css'
// })
// export class DossierAddComponent implements OnInit{

//   patients?: Patient[];


//   // dossier: Dossier = {
//   //   diagnostic: '',
//   // }

//   constructor(private dossierService: DossierService, private patientService: PatientService, private router: Router){}

//   ngOnInit() {
//     this.getListPatients();
//   }

//   getListPatients(){
//     this.patientService.getAll().pipe(
//       tap((data: Patient[] | undefined) => {
//         this.patients = data;
//         console.log('Patients loaded:', this.patients);
//       })
//     ).subscribe();
//   }

  
//   // createDossier(){
//   //   const data = {
//   //     patient: this.dossier.patient,
//   //     diagnostic: this.dossier.diagnostic
//   //   };

//   //   this.dossierService.create(data).subscribe({
//   //     next: (data) => {
//   //       if(this.dossier.patient == null){
          
//   //       }
//   //       this.dossier = data;
//   //       this.router.navigate(['/dossiers/']);
//   //       console.log(data);
//   //     },
//   //     error: (e) => console.log(e)
//   //   })
//   // }
  



// }
