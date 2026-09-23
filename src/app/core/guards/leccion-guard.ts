import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const leccionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const leccionDestino = Number(route.paramMap.get('id'));
  const progresoRealStr = localStorage.getItem('leccionActual');
  const progresoReal = progresoRealStr ? Number(progresoRealStr) : 1;
  if (leccionDestino > progresoReal) {
    console.warn('Acceso denegado: Aún no has desbloqueado esta lección.');
    router.navigate(['/leccion', progresoReal]);
    return false;
  }
  return true;
};
