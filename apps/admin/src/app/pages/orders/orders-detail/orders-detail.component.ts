import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@bluebits/orders';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit {
  order: Order;
  orderStatuses = []; //transfer ORDER_STATUS obj to an array
  selectedStatus: any; //for drop down list
  
  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute, //catch url params.id 
  ) {}

  ngOnInit(): void {
    this._getOrder(); //get an order data
    this._mapOrderStatus(); ////transfer ORDER_STATUS obj to an array for drop down list
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  onStatusChange(event) {
    //console.log(event.value) => get drop down list selcted value  
    this.orderService.updateOrder({ status: event.value }, this.order.id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order is updated!'
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Order is not updated!'
        });
      }
    );
   
  }

  private _getOrder(){
    this.route.params.subscribe((params) => {
      if(params.id){
        this.orderService.getOrder(params.id).subscribe((orderFromDB) => {
          this.order = orderFromDB;
          this.selectedStatus = orderFromDB.status; //set value from db to drop down list
        })
      }
    })
    
  }

}
