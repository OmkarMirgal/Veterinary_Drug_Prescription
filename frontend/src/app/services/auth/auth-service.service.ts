import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ISignupData, ILoginData, ILoginResponse } from '../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

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

  signup(data: ISignupData): Observable<boolean> {
    return this.http
      .post(`${this.apiUrl}/signup`, { user: { ...data } }, this.httpOptions )
      .pipe(
        map((response) => !!response),
        catchError(this.handleError<boolean>('signup', false))
      );
  }

  login(data: ILoginData): Observable<{success: boolean, message: string}> {
    return this.http
      .post<ILoginResponse>(`${this.apiUrl}/login`, { user: { ...data } }, this.httpOptions )
      .pipe(
        tap((response: ILoginResponse) => {
          this.setToken(response.token);
        }),
        map((response:ILoginResponse) => ({ success: !!response.token, message: response.message })),
        catchError((error) => {
          const errorMsg = error.error ? error.error.error : 'Login failed';
          return of({ success: false, message: errorMsg });
        })
      );
  }

  logout(): Observable<{ success: boolean, message: string }> {
    return this.http
      .post<{ message?: string }>(`${this.apiUrl}/logout`, {}, this.httpOptions)
      .pipe(
        tap((response) => {
          if (response.message === 'Logged out successfully') {
            this.unsetToken(this.tokenKey);
          }
        }),
        map(() => ({ success: true, message: 'Logged out successfully' })),
        catchError((error) => {
          const errorMsg = error.error ? error.error : 'Logout failed';
          return of({ success: false, message: errorMsg });
        })
      );
  } 

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  private unsetToken(token: string): void {
    localStorage.removeItem(this.tokenKey);
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
