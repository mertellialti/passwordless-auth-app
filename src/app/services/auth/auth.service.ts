import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticatedSignal = signal(false);

  constructor(private http: HttpClient) { }

  generateRegistrationOptions(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams();
    params = params.append('id', userId);
    return this.http.get(`${environment.apiUrl}/auth/generate-registration-options`, { headers: headers, params: params }).pipe(
      map((response: any) => response),
    );
  }

  verifyRegistrationResponse(registrationResponse: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/auth/verify-registration-response`, registrationResponse,{ headers: headers } ).pipe(
      map((response: any) => response),
    );;
  }

  getAuthenticationOptions(username: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get(`${environment.apiUrl}/auth/get-authentication-options`,{ headers: headers, params: params }).pipe(
      map((response: any) => response),
    );;
  }

  verifyAuthenticationResponse(authenticationResponse: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${environment.apiUrl}/auth/verify-authentication-response`, authenticationResponse,{ headers: headers }).pipe(
      map((response: any) => response),
    );;
  }
}
