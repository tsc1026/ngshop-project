import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { CartIConComponent } from './components/cart-icon/cart-icon.component';
import { BadgeModule } from 'primeng/badge';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from 'libs/users/src/lib/pages/login/login.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'cart', component: CartPageComponent},
  {path:'checkout', component: CheckoutPageComponent},
  {path:'success', component: ThankYouComponent}
]

@NgModule({
  imports: [
    CommonModule,
    BadgeModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    ToastModule
  ],
  declarations: [CartIConComponent, CartPageComponent, OrderSummaryComponent, CheckoutPageComponent, ThankYouComponent],
  exports: [CartIConComponent, CartPageComponent, OrderSummaryComponent, CheckoutPageComponent, ThankYouComponent],
})
export class OrdersModule {
  
  constructor(cartService: CartService){
    cartService.initCartLocalStorage();
  }
}
