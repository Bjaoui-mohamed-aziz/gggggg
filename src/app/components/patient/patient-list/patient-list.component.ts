import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { Patient } from '../../../models/dossier.model';
import { PatientService } from '../../../services/patient-service/patient.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPatientComponent } from '../add-patient/add-patient.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, AddPatientComponent],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  showForm = false;

  constructor(
    private service: PatientService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  // Fetch all patients
  loadPatients() {
    this.service
      .getAll()
      .pipe(
        tap((data: Patient[] | undefined) => {
          this.patients = data || [];
        })
      )
      .subscribe();
  }

  // Called when a new patient is added
  onPatientAdded() {
    this.loadPatients();
    this.showForm = false;
  }

  // Method to edit patient
  editPatient(patient: Patient) {
    const modalRef = this.modalService.open(AddPatientComponent); // Open the modal for editing
    modalRef.componentInstance.newPatient = { ...patient }; // Pass the existing patient data

    modalRef.result.then((result) => {
      if (result === 'Save click') {
        this.updatePatient(patient.id, modalRef.componentInstance.newPatient);
      }
    });
  }

  // Method to update patient
  updatePatient(id: number | undefined, updatedPatient: Patient) {
    if (id !== undefined) {
      this.service.update(id, updatedPatient).subscribe(() => {
        console.log('Patient updated:', updatedPatient);
        this.loadPatients(); // Refresh the patient list
      });
    } else {
      console.error('Invalid patient ID for update:', id);
    }
  }

  deletePatient(patientId: number | undefined): void {
    if (patientId !== undefined) {
      if (confirm('Are you sure you want to delete this patient?')) {
        this.service.delete(patientId).subscribe(() => {
          console.log('Patient deleted:', patientId);
          this.loadPatients(); // Reload patients after deletion
        });
      }
    } else {
      console.error('Invalid patient ID for deletion:', patientId);
    }
  }
}
