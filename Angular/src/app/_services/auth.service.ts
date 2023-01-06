import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password,
    }, httpOptions);
  }

  register(name: string, phoneNumber: string, username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      name,
      phoneNumber,
      username,
      password
    }, httpOptions);
  }
}
