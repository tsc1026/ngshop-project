import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '@env/environment'; 
import { User } from '../models/user';
import { map } from 'rxjs/operators';  
import { JwtHelperService } from '@auth0/angular-jwt';

import * as countriesLib from 'i18n-iso-countries';
import { LocalstorageService } from './localstorage.service';
import { NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
declare const require;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiURLUsers = environment.apiUrl + 'users';
  userLogged = false; 
  userLoggedSub = new BehaviorSubject<boolean>(false); 
  
  helper = new JwtHelperService();  
  decodedToken = {};

  constructor(
    private localstorageService: LocalstorageService,
    private http: HttpClient,
    private router: Router,
    ) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  GetCurrentUserIDByToken(Token:string){
    this.decodedToken = this.helper.decodeToken(Token);
    //console.log(this.decodedToken);
    return this.decodedToken['userId'];
  }

  setUserLogged(){
    this.userLogged = true;
  }

  setUserLogout(){
    this.userLogged = false;
  }

  checkUserLogged(){
    if(this.localstorageService.getToken() || this.userLogged === true)
    {
      this.setUserLogged();
      this.userLoggedSub.next(this.userLogged);
    }
    else{
      this.setUserLogout();
      this.userLoggedSub.next(this.userLogged);
    }
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getUser(userId:string): Observable<User>{
      return this.http.get<User>(`${this.apiURLUsers}/${userId}`)
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countriesLib.getNames('en', { select: 'official' }))
    .map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en');
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }


}
