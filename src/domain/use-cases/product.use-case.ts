import { Injectable, signal, computed, inject } from '@angular/core';
import { ProductRepository } from '../ports/product.repository';
import { Product, CreateProductDTO } from '../models/product.model';
import { firstValueFrom } from 'rxjs';

interface ProductState {
  products: Product[];
  totalRecords: number;
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductUseCase {
  private readonly repository = inject(ProductRepository);

  private readonly state = signal<ProductState>({
    products: [],
    totalRecords: 0,
    selectedProduct: null,
    loading: false,
    error: null
  });

  public products = computed(() => this.state().products);
  public totalRecords = computed(() => this.state().totalRecords);
  public selectedProduct = computed(() => this.state().selectedProduct);
  public isLoading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);

  async loadProducts(pageNumber = 1, pageSize = 10): Promise<void> {
    this.updateState({ products: [], loading: true, error: null });

    try {
      const data = await firstValueFrom(this.repository.getProducts(pageNumber, pageSize));
      const items = Array.isArray(data) ? data : (data?.items ?? []);
      const total = Array.isArray(data) ? data.length : (data?.totalRecords ?? items.length);

      this.updateState({ products: items, totalRecords: total, loading: false });
    } catch (err) {
      console.error(`Error loading products:`, err);
      this.updateState({ products: [], error: 'Error load product', loading: false });
    }
  }

  async loadProductById(id: number): Promise<void> {
    const cachedProduct = this.state().products.find(u => u.id === id);
    if (cachedProduct) {
      this.updateState({ selectedProduct: cachedProduct, error: null });
      return;
    }

    this.updateState({ loading: true, error: null, selectedProduct: null });

    try {
      const product = await firstValueFrom(this.repository.getProductById(id));
      this.updateState({ selectedProduct: product, loading: false });
    } catch (err) {
      console.error(`Error loading product ID ${id}:`, err);
      this.updateState({ error: 'Error loading product details', loading: false });
    }
  }

  clearSelectedProduct(): void {
    this.updateState({ selectedProduct: null });
  }

  async add(productDTO: CreateProductDTO): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      await firstValueFrom(this.repository.createProduct(productDTO));
      await this.loadProducts(1, 10);
    } catch (err) {
      console.error('ProductUseCase -> add falló:', err);
      this.updateState({ error: 'Error create product', loading: false });
    }
  }

  async update(id: number, productDTO: CreateProductDTO): Promise<void> {
    this.updateState({ loading: true, error: null });

    try {
      const updatedProduct = await firstValueFrom(this.repository.updateProduct(id, productDTO));

      this.state.update(s => ({
        ...s,
        loading: false,
        products: s.products.map(p => p.id === id ? updatedProduct : p),
        selectedProduct: updatedProduct
      }));
    } catch (err) {
      console.error('ProductUseCase -> update falló:', err);
      this.updateState({ error: 'Error updating product', loading: false });
      throw err;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await firstValueFrom(this.repository.deleteProduct(id));

      const s = this.state();
      this.updateState({
        products: s.products.filter(u => u.id !== id),
        totalRecords: s.totalRecords > 0 ? s.totalRecords - 1 : 0
      });
    } catch (err) {
      console.error('ProductUseCase -> remove falló:', err);
      this.updateState({ error: 'Product deletion error' });
    }
  }

  private updateState(partialState: Partial<ProductState>): void {
    this.state.update(s => ({ ...s, ...partialState }));
  }
}