import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ICreatePrescription, IPrescriptionData } from '../../model/prescription';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:3000/api/prescriptions';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private get httpOptions() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `${token}` : ''
      })
    };
  }

  getPrescriptions(): Observable<IPrescriptionData[]> {
    return this.http.get<IPrescriptionData[]>(`${this.apiUrl}`, this.httpOptions);
  }

  //NOTE: Not used
  getPrescription(id:number): Observable<IPrescriptionData> {
    return this.http.get<IPrescriptionData>(`${this.apiUrl}/${id}`, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error.error || 'An unknown error occurred';
        console.error('Error fetching prescriptions:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createPrescription(data: ICreatePrescription): Observable<IPrescriptionData> {
    return this.http
      .post<IPrescriptionData>(`${this.apiUrl}`, { prescription: { ...data } }, this.httpOptions )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMsg = error.error.errors || 'An unknown error occurred';
          console.error('Error creating prescription:', errorMsg);
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  editStable(id:number, data:ICreatePrescription): Observable<IPrescriptionData> {
    return this.http.put<IPrescriptionData>(`${this.apiUrl}/${id}`, { prescription: { ...data } }, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error.errors || 'An unknown error occurred';
        console.error('Error updating prescription:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deletePrescription(id:number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.statusText || 'An unknown error occurred';
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
