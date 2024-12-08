import {
  Component,
  inject,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient-service/patient.service';
import { Patient } from '../../../models/dossier.model';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-patient',
  
  standalone: true,

  imports: [NgbDatepickerModule, FormsModule, CommonModule],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],

})

export class AddPatientComponent {
  @Output() patientAdded = new EventEmitter<void>();
  private service = inject(PatientService);
  private modalService = inject(NgbModal);
  newPatient: Patient = {};
  closeResult = '';

  createPatient(): void {
    if (
      this.newPatient.nom &&
      this.newPatient.prenom &&
      this.newPatient.cin &&
      this.newPatient.telephone
    ) {
      this.service.create(this.newPatient).subscribe({
        next: (patient) => {
          console.log('Patient created:', patient);
          this.newPatient = {}; // Reset form after successful creation
          this.patientAdded.emit(); // Emit event after patient is added
          localStorage.setItem('patientAdded', 'true'); // Set flag in localStorage
          window.location.reload(); // Reload the page
        },
        error: (error) => {
          console.error('Error creating patient:', error);
        },
      });
    } else {
      console.error('All required fields must be filled.');
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(() => {});
  }

  constructor(public toastr: ToastrService) {
    if (localStorage.getItem('patientAdded') === 'true') {
      this.toastr.success('Patient ajouté avec succés ', 'Succes', {
        timeOut: 2500,
        easing: 'bounce',
        progressBar: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: 1500,
        newestOnTop: true,
        closeButton: true,
      });
      localStorage.removeItem('patientAdded');
    }
  }
}
