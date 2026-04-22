import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductUseCase } from '../../../../domain/use-cases/product.use-case';
import { CreateProductDTO } from '../../../../domain/models/product.model';
import { ProductFormComponent } from '../../shared/components/product/form/product-form.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [ProductFormComponent, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, DecimalPipe],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
  public productUseCase = inject(ProductUseCase);
  private readonly router = inject(Router);

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];

  ngOnInit() {
    this.currentPage.set(1);
    this.fetchCurrentPage();
  }

  fetchCurrentPage() {
    this.productUseCase.loadProducts(this.currentPage(), this.pageSize());
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.fetchCurrentPage();
  }

  handleCreateProduct(newProduct: CreateProductDTO) {
    this.productUseCase.add(newProduct);
  }
  handleEditProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  handleDeleteProduct(productId: number) {
    if (confirm('Are you confirming that you want to delete this record?')) {
      this.productUseCase.remove(productId);
    }
  }
}