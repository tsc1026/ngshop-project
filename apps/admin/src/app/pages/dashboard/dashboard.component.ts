import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics = [];

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    //subscribe multiple services, it will returns an array includes ordered result
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ]).subscribe((values) => {
      this.statistics = values;
    });
  }

}
