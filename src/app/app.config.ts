import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Importamos nuestra aduana
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. El mesero Inteligente (Ahorro de CPU aglutinando eventos)
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // 2. Encendemos el cliente HTTP global y le inyectamos el Brazo Robótico
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
