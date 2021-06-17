import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private router: Router, private localStorageToken: LocalstorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorageToken.getToken();
  
    if(token){
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      
      //if token is isAdmin and not expired
      if(tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp))
        return true;
    }
    
    //token invalid
    this.router.navigate(['/login']);
    return false;
  }

  //check expired
  private _tokenExpired(expiration): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
