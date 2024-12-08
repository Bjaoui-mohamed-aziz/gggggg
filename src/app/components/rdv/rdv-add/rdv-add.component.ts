import { Component, inject, Output, EventEmitter, Input, TemplateRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rdv } from '../../../models/dossier.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RdvService } from '../../../services/rdvservice/rdv.service';
import { Patient } from '../../../models/dossier.model';
import { PatientService } from '../../../services/patient-service/patient.service';
@Component({
  selector: 'app-rdv-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './rdv-add.component.html',
  styleUrls: ['./rdv-add.component.css']
})
export class RdvAddComponent implements OnInit {
  @Input() newRdv: Rdv = {}; // Ensure this is defined correctly
  @Output() rdvAdded = new EventEmitter<Rdv>();
  private service = inject(RdvService);
  private modalService = inject(NgbModal);
  closeResult = '';
  patients: Patient[] = []; // Array to store patient data

  constructor(
    public toastr: ToastrService,
    private patientService: PatientService // Inject the patient service
  ) { }

  ngOnInit() {
    // Load patients from backend
    this.loadPatients();

    // Check if there is existing data for editing and format it correctly
    if (this.newRdv.daterdv) {
      this.newRdv.daterdv = this.formatDateForInput(this.newRdv.daterdv);
    }
    if (this.newRdv.heurerdv) {
      this.newRdv.heurerdv = this.formatTimeForInput(this.newRdv.heurerdv);
    }

    // Assign patient_id if patient exists
    if (this.newRdv.patient && this.newRdv.patient.id) {
      this.newRdv.patient_id = this.newRdv.patient.id;
    }
  }

  loadPatients() {
    // Fetches the list of patients and assigns it to the patients array
    this.patientService.getAll().subscribe({
      next: (data: Patient[]) => {
        this.patients = data;
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
        this.toastr.error('Erreur lors du chargement de la liste des patients', 'Erreur');
      }
    });
  }

  // Format the date from 'dd/MM/yyyy' to 'yyyy-MM-dd' for input
  formatDateForInput(dateString: string): string {
    const [day, month, year] = dateString.split('/').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Format the time from 'hh:mm a' to 'HH:mm' for input
  formatTimeForInput(timeString: string): string {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // Create new rendez-vous
  createRdv(): void {
    if (this.newRdv.patient_id && this.newRdv.daterdv && this.newRdv.heurerdv && this.newRdv.note) {
      const formattedDate = this.formatDateForBackend(this.newRdv.daterdv);
      const formattedTime = this.formatTimeForBackend(this.newRdv.heurerdv);

      const payload = {
        patient: { id: this.newRdv.patient_id },
        daterdv: formattedDate,
        heurerdv: formattedTime,
        note: this.newRdv.note
      };

      if (this.newRdv.id) {
        // Update existing rendez-vous
        this.service.updateRdv(this.newRdv.id, payload).subscribe({
          next: () => {
            this.showSuccessToast('Rdv mis à jour avec succès');
            this.rdvAdded.emit(this.newRdv);
            this.modalService.dismissAll();
          },
          error: (error) => {
            console.error('Error updating rdv:', error);
            this.toastr.error('Erreur lors de la mise à jour du rendez-vous', 'Erreur');
          }
        });
      } else {
        // Create new rendez-vous
        this.service.create(payload).subscribe({
          next: () => {
            this.showSuccessToast('Rdv ajouté avec succès');
            this.rdvAdded.emit(this.newRdv);
            this.modalService.dismissAll();
          },
          error: (error) => {
            console.error('Error creating rdv:', error);
            this.toastr.error('Erreur lors de la création du rendez-vous', 'Erreur');
          },
        });
      }
    } else {
      console.error('All required fields must be filled.');
      this.toastr.error('Tous les champs obligatoires doivent être remplis', 'Erreur');
    }
  }

  // Format the date for the backend from 'yyyy-MM-dd' to 'dd/MM/yyyy'
  formatDateForBackend(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  }

  // Format time for backend from 'HH:mm' to 'hh:mm a'
  formatTimeForBackend(timeString: string): string {
    let [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  }

  resetForm(): void {
    this.newRdv = { patient_id: 0, daterdv: '', heurerdv: '', note: '' };
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => { });
  }

  showSuccessToast(message: string): void {
    this.toastr.success(message, 'Succès', {
      timeOut: 2500,
      easing: 'bounce',
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 1500,
      newestOnTop: true,
      closeButton: true,
    });
  }

  saveRdv(): void {
    if (this.newRdv.id) {
      this.service.updateRdv(this.newRdv.id, this.newRdv).subscribe({
        next: (updatedRdv) => {
          console.log('Rdv mis à jour:', updatedRdv);
          this.resetForm();
          this.rdvAdded.emit(this.newRdv);
          this.showSuccessToast('Rdv mis à jour avec succès');
          this.modalService.dismissAll();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du rdv:', error);
          this.toastr.error('Erreur lors de la mise à jour du rendez-vous', 'Erreur');
        },
      });
    } else {
      this.createRdv();
    }
  }
}
