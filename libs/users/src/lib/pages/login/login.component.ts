import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  isSubmitted = false;
  authError = false; //show error message
  authMessage = 'Email or Password are wrong';

  constructor(
    private formBuilder:FormBuilder,
    private authService: AuthService,
    private localstorageService: LocalstorageService,
    private router: Router,
    private usersService: UsersService,
    ) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(){
    this.loginFormGroup = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    this.isSubmitted = true;

    //if form is invalid 
    if(this.loginFormGroup.invalid) 
      return;
   
    this.authService.login(this.loginForm.email.value, this.loginForm.password.value)
    .subscribe((userFromDB) => {
      this.localstorageService.setUserName(userFromDB['userName']);//set username to localstorage
      this.authError = false; //do not show error message
      this.localstorageService.setToken(userFromDB.token);
      this.router.navigate(['/']);
    },
    //invlid 
    (error:HttpErrorResponse) => {
      this.authError = true;
      if (error.status !== 400) {
        this.authMessage = 'Error in the Server, please try again later!';
      }
    })

    this.usersService.setUserLogged(); //set loging status to true
    this.usersService.checkUserLogged();//send login status to subscribers
  }

  get loginForm(){
    return this.loginFormGroup.controls;
  }

}
