import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@bluebits/users';
import { LocalstorageService } from 'libs/users/src/lib/services/localstorage.service';
import { UsersService } from 'libs/users/src/lib/services/users.service';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [
  ]
})
export class CheckoutPageComponent implements OnInit {

  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private localstorageService: LocalstorageService,
    private messageService: MessageService,
  ) { }
  
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  userId = '';
  countries = [];
  currentUserObj = {};

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems(); //一進此頁就去取購物車內items
    this._getCountries();
    this._getCurrentUserID();
  }

  //從ls中取token之後解碼取出user id 
  private _getCurrentUserID(){
    if(this.localstorageService.getToken())
      this.userId = this.usersService.GetCurrentUserIDByToken(this.localstorageService.getToken());
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  //取購物車內items 並更新到 this.orderItems 變數, 等等給表單使用
  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
  }
  
  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    //check toke in localstorage includes user id or not 
    if(this.userId.length === 0){ //invalid token
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please login to buy!'
      });
      timer(2000)
      .toPromise()
      .then(() => {
        this.router.navigate(['/login']);
      });
    }
    else{ //valid token
      const order: Order = {
        orderItems: this.orderItems,
        shippingAddress1: this.checkoutForm.street.value,
        shippingAddress2: this.checkoutForm.apartment.value,
        city: this.checkoutForm.city.value,
        zip: this.checkoutForm.zip.value,
        country: this.checkoutForm.country.value,
        phone: this.checkoutForm.phone.value,
        status: 0, 
        user: this.userId, 
        dateOrdered: `${Date.now()}` //to string
      };
  
      this.ordersService.createOrder(order).subscribe(
        //successful
        () => {
          //redirect to thank you page // payment
          this.cartService.emptyCart(); //clear cart
          this.router.navigate(['/success']);
        },
        () => {
          //display some message to user
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something wnet wrong when you create this order!'
          });
          timer(2000)
          .toPromise()
          .then(() => {
            this.router.navigate(['/login']);
          });
        }
      );
    }
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
