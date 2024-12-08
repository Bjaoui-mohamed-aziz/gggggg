import { Diagnostic } from './../../../models/diagnostic.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:9090/api/v1/diagnostics';
const base = 'http://localhost:9090/api/v1';


@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Diagnostic[]> {
    return this.http.get<Diagnostic[]>(baseUrl);
  }

  get(id: any): Observable<Diagnostic> {
    return this.http.get<Diagnostic>(`${baseUrl}/${id}`);
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
  

  findByPatient(patientID: any): Observable<Diagnostic[]> {
    return this.http.get<Diagnostic[]>(`${base}/dossiers/${patientID}`);
  }


}
