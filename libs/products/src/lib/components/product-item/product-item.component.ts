import { Component, Input, OnInit } from '@angular/core';
import { CartItem, CartService } from '@bluebits/orders';
import { Product } from '../../models/product';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {
  @Input() productInput: Product;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
  }


  addProductToCart(){
    //refers to @Input() productInput to create a new CartItem obj
    const cartItem: CartItem = {
      productId: this.productInput.id,
      quantity: 1,
    }

    //add CartItem obj to cart
    this.cartService.setCartItem(cartItem);
  }

}
