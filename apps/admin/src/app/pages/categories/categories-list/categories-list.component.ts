import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',
  styles: []
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endsub$: Subject<any> = new Subject(); //ending observable

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
  ) {}
  
  //delete observable
  ngOnDestroy(): void {
    this.endsub$.next();
    this.endsub$.complete();
  }

  ngOnInit(): void {
    this._getCategories();
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(categoryId).subscribe(
          () => {
            this._getCategories(); //after deelting, get catetories data again and display
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category is deleted!'
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category is not deleted!'
            });
          }
        );
      }
    });
  }

  updateCategory(categoryid: string) {
    //refers to app.module check router
    this.router.navigateByUrl(`categories/form/${categoryid}`);
  }

  private _getCategories() {
    this.categoriesService
    .getCategories()
    //save memory
    //observing until this.endsub$, => when this component is destroied then end subscribing
    .pipe(takeUntil(this.endsub$)) 
    .subscribe((cats) => {
      this.categories = cats;
    });
  }
}
