import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiURLProducts = environment.apiUrl + 'products';

  constructor(private http: HttpClient) {}

  //categoriesFilter?: string[]: get products by specific categories
  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    
    //if receive ctegories ids(array):["5f15d545f3a046427a1c26e2", "5f15d54cf3a046427a1c26e3"], get products by specific categories' id
    if(categoriesFilter){
      params = params.append('categories', categoriesFilter.join(','))
    }
    return this.http.get<Product[]>(this.apiURLProducts, { params: params });
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  getProduct(productId:string): Observable<Product>{
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`)
  }

  updateProduct(productData: FormData, productid: string): Observable<Product> {
    console.log('123');
    productData.forEach((value,key) => {
      console.log(key+" "+value)
    });

    return this.http.put<Product>(`${this.apiURLProducts}/${productid}`, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  getFeaturedProducts(count:number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
  }
}
