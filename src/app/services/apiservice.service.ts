import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post(endpoint: string, data: any): Observable<HttpResponse<any>> {
    const url = `${this.apiUrl}${endpoint}`; 
    return this.http.post<any>(url, data, { observe: 'response' }) 
      .pipe(
        catchError(this.handleError)
      );
  }
  
  get(endpoint: string): Observable<HttpResponse<any>> {
    return this.http.get(`${this.apiUrl}${endpoint}`,{ observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
