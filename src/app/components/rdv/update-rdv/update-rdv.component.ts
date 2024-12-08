// update-rdv.component.ts
import { Component, inject, Input, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Rdv } from '../../../models/dossier.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RdvService } from '../../../services/rdvservice/rdv.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-rdv',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './update-rdv.component.html',
  styleUrls: ['./update-rdv.component.css']
})
export class UpdateRdvComponent implements OnInit {
  @Input() newRdv: Rdv = {}; // Model for the RDV
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  private modalService = inject(NgbModal);
  private service = inject(RdvService);
  @Output() rdvUpdated = new EventEmitter<Rdv>();

  constructor(public toastr: ToastrService){}
  ngOnInit() {

  }

  formatDateForInput(dateString: string): string {
    const [day, month, year] = dateString.split('/').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Format the time from 'hh:mm a' to 'HH:mm' for input
  formatTimeForInput(timeString: string): string {
    if (!timeString.includes(" ")) {
      // If there's no AM/PM suffix, assume it's already in 24-hour format
      return timeString;
    }
  
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    // Convert 12-hour time to 24-hour time format
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // Format to HH:mm
  }
  

  openEditModal(rdv: Rdv) {
    this.newRdv = { 
        ...rdv,
        patient_id: rdv.patient?.id // Ensure patient ID is extracted if nested in patient
    };

    // Format date and time fields to be compatible with the input requirements
    if (this.newRdv.daterdv) {
        this.newRdv.daterdv = this.formatDateForInput(this.newRdv.daterdv);
    }
    if (this.newRdv.heurerdv) {
        this.newRdv.heurerdv = this.formatTimeForInput(this.newRdv.heurerdv);
    }

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' });
}

saveRdv() {
  if (this.newRdv && this.newRdv.id) {
    // Convert the date and time fields to the required formats
    this.newRdv.daterdv = this.formatDateForPayload(this.newRdv.daterdv || '');
    this.newRdv.heurerdv = this.formatTimeForPayload(this.newRdv.heurerdv || '');

    this.service.updateRdv(this.newRdv.id, this.newRdv).subscribe({
      next: (updatedRdv) => {
        console.log('Rendez-vous updated:', updatedRdv);
        this.modalService.dismissAll(); // Close the modal on success
      },
      error: (error) => console.error('Error updating rendez-vous:', error)
    });
  }
}


// Converts 'yyyy-MM-dd' to 'dd/MM/yyyy'
formatDateForPayload(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Converts 'HH:mm' to 'hh:mm AM/PM'
formatTimeForPayload(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${String(formattedHours).padStart(2, '0')}:${minutes} ${ampm}`;
}



  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {});
  }

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
        // Mise à jour du rendez-vous existant
        this.service.updateRdv(this.newRdv.id, payload).subscribe({
          next: () => {
            this.rdvUpdated.emit(this.newRdv); // Émet l'événement avec le rdv mis à jour
            this.modalService.dismissAll();
          },
          error: (error) => {
            console.error('Error updating rdv:', error);
            this.toastr.error('Erreur lors de la mise à jour du rendez-vous', 'Erreur');
          }
        });
      }
    } else {
      console.error('All required fields must be filled.');
      this.toastr.error('Tous les champs obligatoires doivent être remplis', 'Erreur');
    }
  }
  formatDateForBackend(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`; // Convert to dd/MM/yyyy
  }

  // Format time for backend from 'HH:mm' to 'hh:mm a'
  formatTimeForBackend(timeString: string): string {
    let [hours, minutes] = timeString.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set to 12
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`; // Convert to hh:mm a
  }

}