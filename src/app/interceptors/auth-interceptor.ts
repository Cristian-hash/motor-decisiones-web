import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

import { inject, Inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //1.EL BRAZO ROBOTICO BUSCA LA CAJA FUERTE
  //'localStorage' es el almacen del navegador. Buscamos la llave 'token'.
  // Pongo este log afuera para saber si el archivo fue invocado
  const authService = inject(AuthService);

  console.log('🦾 Brazo Robótico encendido. Revisando al mensajero...');
  const token = localStorage.getItem('token');

  let peticionFinal = req;

  // 2. TOMA DE DECISIÓN (Sin hacer un 'return' prematuro antes de evaluar)
  if (token) {
    // Clonamos al mensajero porque la petición original es inmutable
    peticionFinal = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('🛡️Brazo Robótico: Gafete pegado al mensajero.');
    // Le abrimos la puerta para que salga con el nuevo casco
  } else {
    console.log('Brazo Robotico: Mensajero sale sin Gafete (No hay token).');
  }

  return next(peticionFinal).pipe(
    catchError((error: HttpErrorResponse) => {
      // ESCENARIO A: El Faraón (Backend) dice que el token caducó o es falso
      if (error.status === 401) {
        console.warn('[Interceptor] Token caducado o invalido. Ejecutando protocolo de limpieza.');
        alert('Tu sesión ha expirado por seguridad. Por favor, ingresa nuevamente.');
        authService.cerrarSesion();
      } else if (error.status === 500) {
        console.error('[Interceptor] Error critico en el servidor de SpringBoot.');
        alert('El motor de Decisiones esta experimentando problemas. Intenta más tarde.');
      }
      return throwError(() => error);
    }),
  );
};
