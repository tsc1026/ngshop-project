import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersModule } from '@bluebits/orders';
import { UiModule } from '@bluebits/ui';
import { ProductsSearchComponent } from './components/products-search/products-search.component';
import { CategoriesBannerComponent } from './components/categories-banner/categories-banner.component';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/InputNumber';
import { RatingModule } from 'primeng/rating';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductPageComponent } from './pages/product-page/product-page.component';

const routes:Routes = [
  {path: 'products', component: ProductsListComponent},
  {path: 'category/:categoryid', component: ProductsListComponent},
  {path: 'products/:productid', component: ProductPageComponent},
]

//RouterModule.forChild(routes): add these routes to NGShop app.Module 
@NgModule({
  imports: [CommonModule, 
            OrdersModule, 
            RouterModule.forChild(routes), 
            ButtonModule,
            CheckboxModule,
            FormsModule,
            RatingModule,
            InputNumberModule,
            UiModule,
           ],
  declarations: [ProductsSearchComponent, CategoriesBannerComponent, ProductItemComponent, FeaturedProductsComponent, ProductsListComponent, ProductPageComponent],
  exports: [ProductsSearchComponent, CategoriesBannerComponent, ProductItemComponent, FeaturedProductsComponent, ProductsListComponent, ProductPageComponent], //要exports才可以被其他components使用
})
export class ProductsModule {}
