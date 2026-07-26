import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  //1. Inyectamos el enrutador  para poder redirigir si es necesario
  const router = inject(Router);
  // 2. Buscamos el pase VIP el en bolsillo del navegador
  const token = localStorage.getItem('token');
  // 3. Tomamos la decision
  if (token) {
    //Si hay un token , devolvemos 'true'. El componente visual se carga.
    return true;
  } else {
    //Si no hay token ,lo mandamos al login y devolvemos 'false' (bloqueamos la ruut actual)
    router.navigate(['']);
    return false;
  }
};
