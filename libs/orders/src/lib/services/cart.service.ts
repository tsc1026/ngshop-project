import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //send cart object in ls(localstorage) to subscribers
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  //initialize cart
  initCartLocalStorage() {
    //check cart is existed in loclastorage or not
    const cart: Cart = this.getCart(); 
    
    //if no cart in ls
    if(!cart){
      //create a new cart
      const intialCart = {
        items: []
      };
       //transfer to string then storage in ls
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    }
  }

  //get cart from ls
  getCart(): Cart{
    const cartJsonString: string = localStorage.getItem(CART_KEY); 
    const cart: Cart = JSON.parse(cartJsonString); //srting to obj
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart{
    const cart = this.getCart(); 
    
    //check cartItem.productId is already existed in cart?
    const cartItemExist = cart.items.find((ele) => ele.productId === cartItem.productId)
    //if exists then change quantity 
    if(cartItemExist){
      cart.items.map((ele) => {
        if(ele.productId === cartItem.productId){
          if (updateCartItem) {
            ele.quantity = cartItem.quantity;
          } else {
            ele.quantity = ele.quantity + cartItem.quantity;
          }
          return ele;
        }
      })
    }
    //user add new product
    else{
      cart.items.push(cartItem);
    }
   
    const cartJson = JSON.stringify(cart); 
    localStorage.setItem(CART_KEY, cartJson); 
    this.cart$.next(cart);
    return cart;
  }

  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }

  deleteCartItem(InputProductId: string) {
    const cart = this.getCart(); //get cart obj from ls
    //delet item in the cart
    const newCartItems = cart.items.filter(item => item.productId !== InputProductId)
    cart.items = newCartItems;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    //send new cart info to subscribers
    this.cart$.next(cart);
  }

}
