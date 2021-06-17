import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TOKEN = 'jwtToken';
const USERNAME = 'userName';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  userLoggedName = new BehaviorSubject<string>('Guest');
  
  setToken(data){
    localStorage.setItem(TOKEN, data);
  }

  removeToken(){
    localStorage.removeItem(TOKEN);
  }

  getToken():string{
    return localStorage.getItem(TOKEN);
  }

  setUserName(username){
    localStorage.setItem(USERNAME, username);
    this.userLoggedName.next(username); 
  }

  removeUserName(){
    localStorage.removeItem(USERNAME);
  }

  getUserName():string{
    return localStorage.getItem(USERNAME);
  }

}
