import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { presentationRoutes } from '../infrastructure/presentation/presentation.routes';
import { inPortsProviders } from './ports-config/in-ports-config';
import { outPortsProviders } from './ports-config/out-ports-config';
import { errorInterceptor } from '../infrastructure/adapters/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(presentationRoutes),
    provideHttpClient(
      withFetch(),
      withInterceptors([errorInterceptor])
    ),
    ...inPortsProviders,
    ...outPortsProviders
  ]
};