import { Routes } from '@angular/router';
import { DossierListComponent } from './components/dossier/dossier-list/dossier-list.component';

// import { DossierAddComponent } from './components/dossier/dossier-add/dossier-add.component';
import { DossierDetailsComponent } from './components/dossier/dossier-details/dossier-details.component';
import { PatientListComponent } from './components/patient/patient-list/patient-list.component';
import { AddPatientComponent } from './components/patient/add-patient/add-patient.component';
import { RdvAddComponent } from './components/rdv/rdv-add/rdv-add.component';
import { ListRdvComponent } from './components/rdv/list-rdv/list-rdv.component';
import { DiagnosticAddComponent } from './components/diagnostic/diagnostic-add/diagnostic-add.component';
import { DiagnosticDetailsComponent } from './components/diagnostic/diagnostic-details/diagnostic-details.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  { path: 'add-diag', component: DiagnosticAddComponent },
  { path: 'diagnostics/:id', component: DiagnosticDetailsComponent },
  { path: 'dossier/:id', component: DossierDetailsComponent },
  
  { path: 'dossiers', component: DossierListComponent },
  // { path: 'add-dossier', component: DossierAddComponent },

  { path: 'patients', component: PatientListComponent },
  { path: 'add-patient', component: AddPatientComponent },
  { path: 'rdvs', component: ListRdvComponent},
  { path: 'calendar', component: CalendarComponent }
];
