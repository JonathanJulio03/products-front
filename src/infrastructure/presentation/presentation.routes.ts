import { Routes } from '@angular/router';

export const presentationRoutes: Routes = [
  { 
    path: 'products', 
    loadComponent: () => import('./pages/product/product-page.component').then(m => m.ProductPageComponent) 
  },
  { 
    path: 'products/:id', 
    loadComponent: () => import('./pages/product/detail/product-detail-page.component').then(m => m.ProductDetailPageComponent) 
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' }
];