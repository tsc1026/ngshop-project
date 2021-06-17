import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'product-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage: boolean; //show category side bar or not 

  constructor(
    private prodService: ProductsService,
    private catService: CategoriesService,
    private route: ActivatedRoute, 
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
      params.categoryid ? (this.isCategoryPage = true) : (this.isCategoryPage = false); 
    });
    this._getCategories();
  }

  private _getProducts(categoriesFilter?: string[]){
    this.prodService.getProducts(categoriesFilter).subscribe((resPorducts) => {
      this.products = resPorducts;
    })
  }

  private _getCategories(){
    this.catService.getCategories().subscribe((resCategories) => {
      this.categories = resCategories;
    })
  }

  categoryFilter(){
    const selectedCategories = this.categories
    .filter((category) => category.checked) 
    .map((category) => category.id);
    this._getProducts(selectedCategories);
  }
}
