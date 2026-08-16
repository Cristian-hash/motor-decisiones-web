import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  let peticionFinal = req;

  if (token) {
    peticionFinal = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(peticionFinal).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('[Interceptor] Token caducado o inválido. Ejecutando protocolo de limpieza.');

        alert('Tu sesión ha expirado por seguridad. Por favor, ingresa nuevamente.');
        authService.cerrarSesion();
      } else if (error.status === 500) {
        console.error('[Interceptor] Error crítico en el servidor de Spring Boot.');

        alert('El motor de Decisiones está experimentando problemas. Intenta más tarde.');
      }

      return throwError(() => error);
    }),
  );
};
