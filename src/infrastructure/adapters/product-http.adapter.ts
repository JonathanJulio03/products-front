import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRepository } from '../../domain/ports/product.repository';
import { Product, CreateProductDTO } from '../../domain/models/product.model';
import { PaginatedResponse } from '../../domain/models/shared/paginated-response.model';
import { environment } from '../../environments/environment';

@Injectable()
export class ProductHttpAdapter implements ProductRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiProductUrl}`;

  getProducts(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Product>> {
    const params = new HttpParams()
      .set('page', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe();
  }

  createProduct(product: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: CreateProductDTO): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}