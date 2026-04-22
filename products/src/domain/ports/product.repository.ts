import { Observable } from 'rxjs';
import { Product, CreateProductDTO } from '../models/product.model';
import { PaginatedResponse } from '../models/shared/paginated-response.model';

export abstract class ProductRepository {
  abstract getProducts(pageNumber?: number, pageSize?: number): Observable<PaginatedResponse<Product>>;
  abstract getProductById(id: number): Observable<Product>;
  abstract createProduct(product: CreateProductDTO): Observable<Product>;
  abstract updateProduct(id: number, product: CreateProductDTO): Observable<Product>;
  abstract deleteProduct(id: number): Observable<void>;
}