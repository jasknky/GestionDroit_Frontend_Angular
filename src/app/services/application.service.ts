import { Injectable } from '@angular/core';
import { ApplicationModel } from '../models/application.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  baseURL = `http://localhost:3000`;

  

  

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {}

  getAllApplications(): Observable<Array<ApplicationModel>> {
    return this.http.get<Array<ApplicationModel>>(`${this.baseURL}/application`);
  }

  getApplicationsByIdUtilisateur(utilisateurId:number): Observable<Array<ApplicationModel>> {
    return this.http.get<Array<ApplicationModel>>(`${this.baseURL}/application?idutilisateur=${utilisateurId}`);
  }


  public updateApplication(data: any): any {
    console.log(data.APPLI_ID);
    return this.http.put('http://localhost:3000/application/' + data.APPLI_ID, JSON.stringify(data),this.httpHeader);
    
  }


  update(id, data): Observable<ApplicationModel> {
    return this.http.put<ApplicationModel>('http://localhost:3000/application/' + id, JSON.stringify(data), this.httpHeader)
    .pipe(
      retry(1),
      catchError(this.httpError)
    )
  }

  addApplication(application: ApplicationModel): Observable<ApplicationModel> {
    return this.http.post<ApplicationModel>(`${this.baseURL}/application`, JSON.stringify(application), this.httpHeader);
  }

  deleteApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/application/${applicationId}`, this.httpHeader);
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
