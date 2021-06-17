import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit {
  editmode = false;
  form: FormGroup;
  isSubmitted = false;
  categories = []; //for ddl
  imageDisplay: string | ArrayBuffer; //save users image
  currentProductId: string; //save current product id for editing

  constructor(
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this._initForm();
    //get categories from server
    this._getCategories();
    //Edit or Creat
    this._checkEditMode();
  }

  //if edieMode, use id to db and retrive data then fill into the productForm
  private _checkEditMode(){
    //check url path id, (appModule route => path: 'products/form/:id')
    this.route.params.subscribe((params) => {
      if(params.id){
        this.editmode = true;
        this.currentProductId = params.id; //current editing product id
        //get product data by id
        this.productsService.getProduct(this.currentProductId).subscribe((productFromServer) => {
          //this.productForm calls JS Getter: get productForm() === this.form.controls;
          //this.productForm.name === this.form.controls.name 
          this.productForm.name.setValue(productFromServer.name);
          this.productForm.category.setValue(productFromServer.category.id);
          this.productForm.brand.setValue(productFromServer.brand);
          this.productForm.price.setValue(productFromServer.price);
          this.productForm.countInStock.setValue(productFromServer.countInStock);
          this.productForm.isFeatured.setValue(productFromServer.isFeatured);
          this.productForm.description.setValue(productFromServer.description);
          this.productForm.richDescription.setValue(productFromServer.richDescription);
          //imageDisplay save user upload image paht
          this.imageDisplay = productFromServer.image; 
          
          //product image doesn't need to be checked in edit mode, so remove Validators 
          //updateValueAndValidity: refresh user upload image
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }
    })
  }

  private _initForm(){
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        brand: ['', Validators.required],
        price: ['', Validators.required],
        category: ['', Validators.required],
        countInStock: ['', Validators.required],
        description: ['', Validators.required],
        richDescription: [''],
        image: ['', Validators.required],
        isFeatured: [false],
      }
    )
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid)
      return;
    
    //creating a FormData then send it API
    const productFormData = new FormData();

    //fill data into to the FormData
    productFormData.append('name', this.productForm.name.value);
    productFormData.append('brand', this.productForm.brand.value);
    productFormData.append('price', this.productForm.price.value);
    productFormData.append('countInStock', this.productForm.countInStock.value);
    productFormData.append('category', this.productForm.category.value);
    productFormData.append('isFeatured', this.productForm.isFeatured.value);
    productFormData.append('description', this.productForm.description.value);
    productFormData.append('richDescription', this.productForm.richDescription.value);
    productFormData.append('image', this.productForm.image.value);
    
    //check cerating or editing
    if (this.editmode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

  private _updateProduct(productFormData: FormData) {
    //send product id to this.productsService.updateProduct()
    this.productsService.updateProduct(productFormData, this.currentProductId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product is updated!'
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not updated!'
        });
      }
    );
  }

  onCancle(){
    this.location.back();
  }

  //把categories data fills into ddl
  private _getCategories(){
    this.categoriesService.getCategories().subscribe(categoriesFromServer => {
      this.categories = categoriesFromServer;
    })
  }

  get productForm(){
    return this.form.controls;
  }

  //set user upload image
  onImageUpload(event){
    const file = event.target.files[0];  
    if (file) {
      this.form.patchValue({ image: file });
      //check file type
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader(); 
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file); //read user uploda file
    }
  }

  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData).subscribe(
      (product: Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${product.name} is created!`
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not created!'
        });
      }
    );
  }

}
