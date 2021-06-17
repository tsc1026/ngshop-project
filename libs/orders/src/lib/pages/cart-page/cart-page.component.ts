import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartItemDetailed } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent  implements OnInit, OnDestroy {

  //cart's items details including Product details & quantity
  cartItemsDetailed: CartItemDetailed[];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private ordersService: OrdersService
    ) { }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  ngOnInit(): void {
    this._getCartDetails();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(resCart => {
      //reset cart
      this.cartItemsDetailed = [];
      this.cartCount = 0;

      //calculate how many items in the cart
      this.cartCount = resCart?.items.length ?? 0;
      
      resCart.items.forEach(cartItem => {
        //send cartItem.productId to ordersService.getProduct() to retrive product detail
        this.ordersService.getProduct(cartItem.productId).subscribe(resProduct => {
          //push product detail  cartItem.quantity to cartItemsDetailed array
          this.cartItemsDetailed.push( {product: resProduct, quantity:cartItem.quantity} );
        })
      })
    })
  }

  backToShop(){
    this.router.navigate(['/products']);
  }

  deleteCartItem(cartItem: CartItemDetailed){
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  //change item quantity
  updateCartItemQuantity(event, cartItem: CartItemDetailed){
    this.cartService.setCartItem(
      {
        productId: cartItem.product.id,
        quantity: event.value
      },
      true
    );
  }

}
