import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../models/dossier.model';

const baseUrl = 'http://localhost:9090/api/v1/patients';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(baseUrl);
  }

  get(id: any): Observable<Patient> {
    return this.http.get<Patient>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByCin(cin: any): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${baseUrl}?cin=${cin}`);
  }

  findByDiagnostic(diagnoID: any): Observable<Patient> {
    return this.http.get<Patient>(`${baseUrl}/diagno/${diagnoID}`);
  }


}
