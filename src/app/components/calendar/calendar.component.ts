import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MomentDateAdapter,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { RdvService } from '../../services/rdvservice/rdv.service';
import { tap } from 'rxjs';
import { Patient } from '../../models/dossier.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from '../../services/patient-service/patient.service';
import { ToastrService } from 'ngx-toastr';

export class Rdv {
  id?: number;
  daterdv?: string;
  heurerdv?: string;
  note?: string;
  patient?: Patient;
  patient_id?: number;
  color?: string;
}

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggle,
    FormsModule,
    MatButtonToggleGroup,
    MatIconModule,
    DragDropModule,
    MatDatepickerModule,
    MatInputModule,
    MatDatepicker,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  providers: [
    provideMomentDateAdapter(),
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Input() newRdv: Rdv = {}; // Ensure this is defined correctly
  hoveredRdv: Rdv | null = null;
  popupPosition = { top: 0, left: 0 };
  patients: Patient[] = []; // Array to store patient data
  events: any[] = []; // Events to display in the calendar
  rdvs: Rdv[] = [];
  @Output() rdvAdded = new EventEmitter<Rdv>();
  viewDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays: { date: Date; rdvs: Rdv[] }[] = [];

  currentView: CalendarView = CalendarView.Month;
  timeSlots: string[] = [];

  weeks: { date: Date; rdvs: Rdv[] }[][] = [];

  public CalendarView = CalendarView;

  constructor(
    public dialog: MatDialog,
    private modalService: NgbModal,
    private service: RdvService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private patientService: PatientService,
    public toastr: ToastrService
  ) {
    this.rdvs.forEach((appointment) => {
      appointment.color = this.getRandomColor();
    });
    this.generateView(this.currentView, this.viewDate);
  }

  loadPatients() {
    // Fetches the list of patients and assigns it to the patients array
    this.patientService.getAll().subscribe({
      next: (data: Patient[]) => {
        this.patients = data;
      },
      error: (error) => {
        console.error('Error fetching patients:', error);
        this.toastr.error(
          'Erreur lors du chargement de la liste des patients',
          'Erreur'
        );
      },
    });
  }

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => {
      this.rdvs = data;

      // Assign random colors
      this.rdvs.forEach((rdv) => {
        rdv.color = this.getRandomColor();
      });

      // Generate the view after colors are assigned
      this.generateView(this.currentView, this.viewDate);
      this.loadPatients();

    });

    this.loadPatients();

    // Check if there is existing data for editing and format it correctly
 
    // Assign patient_id if patient exists
    if (this.newRdv.patient && this.newRdv.patient.id) {
      this.newRdv.patient_id = this.newRdv.patient.id;
    }
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.4;
    return `rgba(${r},${g},${b},${a})`;
  }

  generateView(view: CalendarView, date: Date) {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthViewWithRdvs(date, this.rdvs);
        break;
      default:
        this.generateMonthViewWithRdvs(date, this.rdvs);
    }
  }

  showPopup(rdv: Rdv, event: MouseEvent): void {
    this.hoveredRdv = rdv;

    // Set popup position based on mouse coordinates
    this.popupPosition = {
      top: event.clientY + 10, // Slightly below the cursor
      left: event.clientX + 10, // Slightly to the right of the cursor
    };
  }

  hidePopup(): void {
    this.hoveredRdv = null;
  }

  calculateEndTime(heurerdv: string): string {
    // Check if the time includes AM/PM
    const is12HourFormat = /AM|PM/i.test(heurerdv);
    let hour: number = 0,
      minute: number = 0;
    let period = ''; // For storing AM/PM if needed

    if (is12HourFormat) {
      // Parse 12-hour time with AM/PM
      const match = heurerdv.match(/(\d+):(\d+)\s?(AM|PM)/i);
      if (match) {
        hour = parseInt(match[1], 10);
        minute = parseInt(match[2], 10);
        period = match[3].toUpperCase();

        // Convert to 24-hour format for easier calculations
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
      }
    } else {
      // Parse 24-hour time
      [hour, minute] = heurerdv.split(':').map(Number);
    }

    // Add 1 hour
    let endHour = (hour + 1) % 24;
    let endPeriod = ''; // To store the AM/PM period for 12-hour format

    if (is12HourFormat) {
      // Convert back to 12-hour format
      endPeriod = endHour >= 12 ? 'PM' : 'AM';
      if (endHour > 12) endHour -= 12;
      if (endHour === 0) endHour = 12;
    }

    // Format the end time
    const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
    return is12HourFormat
      ? `${formattedEndTime} ${endPeriod}`
      : formattedEndTime;
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
        })
      }
    }
  }

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



  generateMonthViewWithRdvs(date: Date, rdvs: Rdv[]) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1); // Correctly set first day of the month
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month
    this.weeks = [];
    this.monthDays = [];

    // Helper to find RDVs for a given date
    const findRdvsForDate = (day: Date) =>
      rdvs.filter((rdv) => {
        const [dayStr, monthStr, yearStr] = rdv.daterdv!.split('/');
        const rdvDate = new Date(
          parseInt(yearStr, 10),
          parseInt(monthStr, 10) - 1, // Months are 0-based in JS
          parseInt(dayStr, 10)
        );
        return (
          rdvDate.getFullYear() === day.getFullYear() &&
          rdvDate.getMonth() === day.getMonth() &&
          rdvDate.getDate() === day.getDate()
        );
      });

    let week: { date: Date; rdvs: Rdv[] }[] = [];

    // Fill days before the start of the month
    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      const dateInfo = { date: prevDate, rdvs: findRdvsForDate(prevDate) };
      week.push(dateInfo);
      this.monthDays.push(dateInfo);
    }

    // Fill days of the current month
    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      const dateInfo = {
        date: currentDate,
        rdvs: findRdvsForDate(currentDate),
      };
      this.monthDays.push(dateInfo);
      week.push(dateInfo);

      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
    }

    // Fill days after the end of the month
    for (let day = 1; this.monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      const dateInfo = { date: nextDate, rdvs: findRdvsForDate(nextDate) };
      this.monthDays.push(dateInfo);
    }

    // Complete the last week if it's not full
    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      const dateInfo = { date: nextDate, rdvs: findRdvsForDate(nextDate) };
      week.push(dateInfo);
    }

    if (week.length > 0) {
      this.weeks.push(week);
    }
  }

  previous() {
    if (this.currentView === CalendarView.Month) {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthViewWithRdvs(this.viewDate, this.rdvs);
    } else if (this.currentView === CalendarView.Week) {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7)
      );
    }
  }

  next() {
    if (this.currentView === CalendarView.Month) {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthViewWithRdvs(this.viewDate, this.rdvs);
    }
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  viewToday(): void {
    this.viewDate = new Date();
    this.generateMonthViewWithRdvs(this.viewDate, this.rdvs);
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }
}
