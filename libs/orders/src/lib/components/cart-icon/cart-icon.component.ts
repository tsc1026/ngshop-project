import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-car-icon',
  templateUrl: './cart-icon.component.html',
  styles: [
  ]
})
export class CartIConComponent implements OnInit {

  cartCount = 0;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    //subscribe how many items in a user's cart
    this.cartService.cart$.subscribe((cart) => {
      //set default to 0
      this.cartCount = cart?.items?.length ?? 0;
    });
  }

}
