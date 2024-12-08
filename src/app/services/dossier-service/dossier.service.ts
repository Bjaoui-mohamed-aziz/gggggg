// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Dossier } from '../../models/dossier.model';
// import { Patient } from '../../models/dossier.model';



// const baseUrl = 'http://localhost:9090/api/v1/dossiers';


// @Injectable({
//   providedIn: 'root'
// })
// export class DossierService {

//   constructor(private http: HttpClient) { }
  
//   getAll(): Observable<Dossier[]> {
//     return this.http.get<Dossier[]>(baseUrl);
//   }

//   get(id: any): Observable<Dossier> {
//     return this.http.get<Dossier>(`${baseUrl}/${id}`);
//   }

//   create(data: any): Observable<any> {
//     return this.http.post(baseUrl, data);
//   }

//   update(id: any, data: any): Observable<any> {
//     return this.http.put(`${baseUrl}/${id}`, data);
//   }


//   delete(id: any): Observable<any> {
//     return this.http.delete(`${baseUrl}/${id}`);
//   }
  
//   findByCIN(cin: any): Observable<Dossier[]> {
//     return this.http.get<Dossier[]>(`${baseUrl}?cin=${cin}`);
//   }


// }
