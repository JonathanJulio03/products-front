export interface Product {
  id: number;
  price: number;
  name: string;
  description: string;
}

export type CreateProductDTO = Omit<Product, 'id'>;