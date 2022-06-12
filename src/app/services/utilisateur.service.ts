import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { retry,catchError } from 'rxjs/operators';
import { UtilisateurModel } from '../models/utilisateur.model';



@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  baseURL = `http://localhost:3000`;


  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllUtilisateurs(): Observable<Array<UtilisateurModel>> {
    return this.http.get<Array<UtilisateurModel>>(`${this.baseURL}/utilisateur`);
  }

  getAllUtilisateursNoms(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.baseURL}/utilisateur/noms`);
  }


  getUtilisateursByIdGroupe(groupeId:number): Observable<Array<UtilisateurModel>> {
    return this.http.get<Array<UtilisateurModel>>(`${this.baseURL}/utilisateur/${groupeId}`);
  }

  public updateUtilisateur(data: any): any {
    //console.log(data.GRP_ID);
    return this.http.put('http://localhost:3000/utilisateur/' + data.USR_ID, JSON.stringify(data),this.httpHeader);
    
  }


  update(id, data): Observable<UtilisateurModel> {
    return this.http.put<UtilisateurModel>('http://localhost:3000/utilisateur/' + id, JSON.stringify(data), this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  addUtilisateur(utilisateur: UtilisateurModel): Observable<UtilisateurModel> {
    return this.http.post<UtilisateurModel>(`${this.baseURL}/utilisateur`, JSON.stringify(utilisateur), this.httpHeader);
  }

  addUtilisateurInGroupe(utilisateur: UtilisateurModel,utilisateurId : number,groupeId:number): Observable<UtilisateurModel> {
    return this.http.post<UtilisateurModel>(`${this.baseURL}/utilisateur?idutilisateur=${utilisateurId}&idgroupe=${groupeId}`, JSON.stringify(utilisateur), this.httpHeader);
  }

  deleteUtilisateur(utilisateurId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/utilisateur/${utilisateurId}`, this.httpHeader);
  }

  deleteUtilisateurFromGroupe(utilisateurId: number, groupeId:number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/utilisateur?idutilisateur=${utilisateurId}&idgroupe=${groupeId}`, this.httpHeader);
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
