import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ICreateStable, IStableData } from '../../model/stable';

@Injectable({
  providedIn: 'root'
})
export class StableService {

  private apiUrl = 'http://localhost:3000/api/stables';
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

  getStables(): Observable<IStableData[]> {
    return this.http.get<IStableData[]>(`${this.apiUrl}`, this.httpOptions);
  }

  getStable(id:number): Observable<IStableData> {
    return this.http.get<IStableData>(`${this.apiUrl}/${id}`, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error.error || 'An unknown error occurred';
        console.error('Error fetching stable:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  createStable(data: ICreateStable): Observable<IStableData> {
    return this.http
      .post<IStableData>(`${this.apiUrl}`, { stable: { ...data } }, this.httpOptions )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMsg = error.error.errors || 'An unknown error occurred';
          console.error('Error creating stable:', errorMsg);
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  editStable(id:number, data:ICreateStable): Observable<IStableData> {
    return this.http.put<IStableData>(`${this.apiUrl}/${id}`, { stable: { ...data } }, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.error.errors || 'An unknown error occurred';
        console.error('Error updating stable:', errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  deleteStable(id:number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMsg = error.statusText || 'An unknown error occurred';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

}
