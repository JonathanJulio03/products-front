import { Provider } from '@angular/core';
import { ProductRepository } from '../../domain/ports/product.repository';
import { ProductHttpAdapter } from '../../infrastructure/adapters/product-http.adapter';
import { WeatherRepository } from '../../domain/ports/weather.repository';
import { WeatherHttpAdapter } from '../../infrastructure/adapters/weather-http.adapter';

export const outPortsProviders: Provider[] = [
  { provide: ProductRepository, useClass: ProductHttpAdapter },
  { provide: WeatherRepository, useClass: WeatherHttpAdapter }
];