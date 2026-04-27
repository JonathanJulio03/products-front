import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, debounceTime, catchError, exhaustMap, concatMap, tap, EMPTY, Observable } from 'rxjs';
import { Product, CreateProductDTO } from '../models/product.model';
import { ProductRepository } from '../ports/product.repository';

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
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<ProductState>({
    products: [], totalRecords: 0, selectedProduct: null, loading: false, error: null
  });

  public products = computed(() => this.state().products);
  public totalRecords = computed(() => this.state().totalRecords);
  public selectedProduct = computed(() => this.state().selectedProduct);
  public isLoading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);

  private readonly loadAllAction$ = new Subject<{ page: number, size: number }>();
  private readonly loadByIdAction$ = new Subject<number>();
  private readonly createAction$ = new Subject<CreateProductDTO>();
  private readonly updateAction$ = new Subject<{ id: number, dto: CreateProductDTO }>();
  private readonly deleteAction$ = new Subject<number>();

  constructor() {
    this.initConcurrencyPipelines();
  }

  private initConcurrencyPipelines(): void {
    
    this.loadAllAction$.pipe(
      debounceTime(300),
      tap(() => this.updateState({ loading: true, error: null })),
      switchMap(({ page, size }) => this.repository.getProducts(page, size).pipe(
        tap(data => {
          const items = Array.isArray(data) ? data : (data?.items ?? []);
          const total = Array.isArray(data) ? data.length : (data?.totalRecords ?? items.length);
          this.updateState({ products: items, totalRecords: total, loading: false });
        }),
        this.catchAndKeepAlive('Error loading products list')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.loadByIdAction$.pipe(
      tap(() => this.updateState({ loading: true, error: null, selectedProduct: null })),
      switchMap(id => this.repository.getProductById(id).pipe(
        tap(product => this.updateState({ selectedProduct: product, loading: false })),
        this.catchAndKeepAlive(`Error loading product ID`)
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.createAction$.pipe(
      tap(() => this.updateState({ loading: true, error: null })),
      exhaustMap(dto => this.repository.createProduct(dto).pipe(
        tap(() => {
          this.updateState({ loading: false });
          this.loadProducts(1, 10);
        }),
        this.catchAndKeepAlive('Error creating product')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.updateAction$.pipe(
      tap(() => this.updateState({ loading: true, error: null })),
      concatMap(({ id, dto }) => this.repository.updateProduct(id, dto).pipe(
        tap(updatedProduct => this.handleProductUpdated(id, updatedProduct)),
        this.catchAndKeepAlive('Error updating product')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.deleteAction$.pipe(
      tap(() => this.updateState({ loading: true, error: null })),
      concatMap(id => this.repository.deleteProduct(id).pipe(
        tap(() => this.handleProductDeleted(id)),
        this.catchAndKeepAlive('Error deleting product')
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  loadProducts(pageNumber = 1, pageSize = 10): void {
    this.loadAllAction$.next({ page: pageNumber, size: pageSize });
  }

  loadProductById(id: number): void {
    const cachedProduct = this.state().products.find(p => p.id === id);
    if (cachedProduct) {
      this.updateState({ selectedProduct: cachedProduct, error: null });
      return;
    }
    this.loadByIdAction$.next(id);
  }

  add(productDTO: CreateProductDTO): void {
    this.createAction$.next(productDTO);
  }

  update(id: number, productDTO: CreateProductDTO): void {
    this.updateAction$.next({ id, dto: productDTO });
  }

  remove(id: number): void {
    this.deleteAction$.next(id);
  }

  clearSelectedProduct(): void {
    this.updateState({ selectedProduct: null });
  }

  private updateState(partialState: Partial<ProductState>): void {
    this.state.update(s => ({ ...s, ...partialState }));
  }

  private handleProductUpdated(id: number, updatedProduct: Product): void {
    this.state.update(s => ({
      ...s,
      loading: false,
      products: s.products.map(p => p.id === id ? updatedProduct : p),
      selectedProduct: updatedProduct
    }));
  }

  private handleProductDeleted(id: number): void {
    this.state.update(s => ({
      ...s,
      loading: false,
      products: s.products.filter(p => p.id !== id),
      totalRecords: Math.max(0, s.totalRecords - 1)
    }));
  }

  private catchAndKeepAlive<T>(errorMessage: string) {
    return catchError((err: any, caught: Observable<T>) => {
      console.error(`${errorMessage}:`, err);
      this.updateState({ error: errorMessage, loading: false });
      return EMPTY;
    });
  }
}