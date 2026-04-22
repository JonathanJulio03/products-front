import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductUseCase } from '../../../../../domain/use-cases/product.use-case';
import { CreateProductDTO } from '../../../../../domain/models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe, MatSnackBarModule],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss'
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  public readonly productUseCase = inject(ProductUseCase);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  isEditing = signal<boolean>(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  constructor() {
    effect(() => {
      const product = this.productUseCase.selectedProduct();
      if (product) {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price
        });
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productUseCase.loadProductById(Number(id));
    }
  }

  ngOnDestroy(): void {
    this.productUseCase.clearSelectedProduct();
  }

  toggleEditMode(): void {
    this.isEditing.update(val => !val);

    if (!this.isEditing()) {
      const product = this.productUseCase.selectedProduct();
      if (product) {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price
        });
      }
    }
  }

  async saveChanges(): Promise<void> {
    if (this.form.valid) {
      const currentProduct = this.productUseCase.selectedProduct();
      if (currentProduct) {
        const productDTO = this.form.getRawValue() as CreateProductDTO;

        try {
          await this.productUseCase.update(currentProduct.id, productDTO);

          this.router.navigate(['/products']);
        } catch (error) {
          console.log(error);          
          this.snackBar.open('Error save', 'Close', { duration: 5000 });
        }
      }
    }
  }
}