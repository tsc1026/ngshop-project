import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; 
import { User } from '../models/user';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLUsers = environment.apiUrl + 'users';
  
  constructor(private http: HttpClient, 
              private localstorageService: LocalstorageService, 
              private router: Router) { }

  login(userEnterEmail:string, userEnterPassword:string):Observable<User>{
    return this.http.post<User>(`${this.apiURLUsers}/login`, {email:userEnterEmail, password:userEnterPassword});
  }

  logout(){
    this.localstorageService.removeToken();
    this.localstorageService.removeUserName();
    this.router.navigate(['/login']);
  }
}
