import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CreateAccountRequest } from 'src/app/models/account/requests/create/create-account-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  createUser(createAccountRequest: CreateAccountRequest){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });    
    return this.http.post(`${environment.apiUrl}/auth/register`, createAccountRequest,{ headers: headers }).pipe(
      map((response: any) => response),
    );
  }
}
