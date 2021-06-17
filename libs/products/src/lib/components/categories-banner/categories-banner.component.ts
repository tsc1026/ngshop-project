import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Category } from '../../models/category';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endSub$:Subject<any> = new Subject();

  constructor(
    private categoriesService: CategoriesService
  ) { }

  ngOnDestroy(): void {
    this.endSub$.next();
    this.endSub$.complete();
  }

  ngOnInit(): void {
    this.categoriesService
    .getCategories()
    .pipe(takeUntil(this.endSub$))
    .subscribe(categoriesFromDB => {
      this.categories = categoriesFromDB;
    })
  }

}
