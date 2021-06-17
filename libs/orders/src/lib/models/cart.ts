export class Cart {
    items?: CartItem[];
}
  
export class CartItem {
    productId?: string;
    quantity?: number;
}

//item details
export class CartItemDetailed {
    product?: any; //product details
    quantity?: number;
}