import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rdv} from '../../models/dossier.model';



//const BASIC_URL = ["http://localhost:9090"]

const baseUrl = 'http://localhost:9090/api/v1/rdvs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  constructor(private http:HttpClient) {}

  

  create(rdv: any): Observable<any> {
    return this.http.post(baseUrl, rdv);
  }


  getAll(): Observable<Rdv[]> {
    return this.http.get<Rdv[]>(baseUrl);
  }

  updateRdv(id: number, rdv: Rdv): Observable<Rdv> {
    return this.http.put<Rdv>(`${baseUrl}/${id}`, rdv);
  }

  deleteRdv(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  

}
