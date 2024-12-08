import { Component, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { Rdv } from '../../../models/dossier.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RdvAddComponent } from '../rdv-add/rdv-add.component';
import { RdvService } from '../../../services/rdvservice/rdv.service';
import { UpdateRdvComponent } from '../update-rdv/update-rdv.component';
@Component({
  selector: 'app-list-rdv',
  standalone: true,
  imports: [CommonModule, RdvAddComponent, UpdateRdvComponent],
  templateUrl: './list-rdv.component.html',
  styleUrl: './list-rdv.component.css'
})
export class ListRdvComponent {

  rdvs: Rdv[] = [];
  showForm = false;
  @ViewChild(UpdateRdvComponent) updateRdvComponent!: UpdateRdvComponent;


  constructor(
    private service: RdvService,
  ) {}

  ngOnInit() {
    this.loadRdvs();
  }

  // Fetch all rdvs
  loadRdvs() {
    this.service
      .getAll()
      .pipe(
        tap((data: Rdv[] | undefined) => {
          this.rdvs = data || [];
        })
      )
      .subscribe();
  }

  // Called when a new rdv is added
  onRdvAdded() {
    this.loadRdvs();
    this.showForm = false;
  }

  deleteRdv(id: number) {
    this.service.deleteRdv(id).subscribe({
      next: () => {
        console.log(`Rendez-vous with ID ${id} deleted successfully.`);
        this.loadRdvs(); // Reload the list after deletion
      },
      error: (error) => console.error('Error deleting rendez-vous:', error)
    });
  }

  editRdv(rdv: Rdv) {
    this.updateRdvComponent.openEditModal(rdv); // Trigger modal with the selected rdv data
  }
  // Method to delete rdv



}
