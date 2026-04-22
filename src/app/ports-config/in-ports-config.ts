import { Provider } from '@angular/core';
import { ProductUseCase } from '../../domain/use-cases/product.use-case';
import { WeatherUseCase } from '../../domain/use-cases/weather.use-case';

export const inPortsProviders: Provider[] = [
  ProductUseCase,
  WeatherUseCase 
];