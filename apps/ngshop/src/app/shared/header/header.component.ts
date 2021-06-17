import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UsersService } from '@bluebits/users';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../../../../../../libs/users/src/lib/services/localstorage.service';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  
  userLogged = false;
  userName = 'Guest';
  userLoggedSubscription: Subscription; 
  userLoggedNameSubscription: Subscription; 
 
  constructor(
    private localstorageService: LocalstorageService,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {
   
  }

  ngOnInit() {
    this.usersService.checkUserLogged();
    //subscribe login status
    this.userLoggedSubscription = this.usersService.userLoggedSub.subscribe(res => {
      this.userLogged = res;
    });
    //subscribe logged user name for the first time login
    this.userLoggedNameSubscription = this.localstorageService.userLoggedName.subscribe(res => {
      this.userName = res;
    }); 
    //after first time login, we can rely on loclastorage
    this.userName = this.localstorageService.getUserName();
  }
 
  logoutUser(){
    this.authService.logout(); //delet the token & username from localstorage
    this.usersService.setUserLogout(); //set login status to F
    this.usersService.checkUserLogged(); //send login status to subscriber 
    
    //subscribe login status
    this.userLoggedSubscription = this.usersService.userLoggedSub.subscribe(res => {
      this.userLogged = res;
    });
   
  }

}
