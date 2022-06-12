import { Injectable } from '@angular/core';
import { GroupeModel } from '../models/groupe.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  baseURL = `http://localhost:3000`;

  

  

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllGroupes(): Observable<Array<GroupeModel>> {
    return this.http.get<Array<GroupeModel>>(`${this.baseURL}/groupe`);
  }

  getGroupesByIdApplication(applicationId:number): Observable<Array<GroupeModel>> {
    return this.http.get<Array<GroupeModel>>(`${this.baseURL}/groupe/${applicationId}`);
  }

  getGroupesByIdUtilisateur(utilisateurId:number): Observable<Array<GroupeModel>> {
    return this.http.get<Array<GroupeModel>>(`${this.baseURL}/groupe?idutilisateur=${utilisateurId}`);
  }



  public updateGroupe(data: any): any {
    console.log(data.GRP_ID);
    return this.http.put('http://localhost:3000/groupe/' + data.GRP_ID, JSON.stringify(data),this.httpHeader);
    
  }


  update(id, data): Observable<GroupeModel> {
    return this.http.put<GroupeModel>('http://localhost:3000/groupe/' + id, JSON.stringify(data), this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  addGroupe(groupe: GroupeModel): Observable<GroupeModel> {
    return this.http.post<GroupeModel>(`${this.baseURL}/groupe`, JSON.stringify(groupe), this.httpHeader);
  }

  deleteGroupe(groupeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/groupe/${groupeId}`, this.httpHeader);
  }
  
  httpError(error) {
    let msg = '';
    if(error.error instanceof ErrorEvent) {
      // client side error
      msg = error.error.message;
    } else {
      // server side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }

}
