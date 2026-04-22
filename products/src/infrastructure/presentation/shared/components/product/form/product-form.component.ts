import { Component, output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProductDTO } from '../../../../../../domain/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  
  productSubmitted = output<CreateProductDTO>();

  form = this.fb.group({
    name: ['', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.maxLength(150)
    ]],
    
    description: ['', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.maxLength(500)
    ]],
    
    price: [null as number | null, [
      Validators.required, 
      Validators.min(0.01),
      Validators.max(999999999) 
    ]]
  });

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue() as CreateProductDTO;
      this.productSubmitted.emit(formValue);
      
      this.form.reset();
    }
  }
}