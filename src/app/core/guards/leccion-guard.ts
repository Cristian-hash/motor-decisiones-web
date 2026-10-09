import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const leccionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // 1. ¿A qué estación quiere ir el tren?
  const idDestino = Number(route.paramMap.get('id'));

  // 2. ¿Qué dice el pase de abordar que nos dio el Lobby?
  const rutaTexto = localStorage.getItem('rutaNivel');

  if (rutaTexto) {
    const rutaPermitida: number[] = JSON.parse(rutaTexto);

    // 3. LA VERDAD ABSOLUTA: Verificamos si el destino está en el arreglo.
    if (rutaPermitida.includes(idDestino)) {
      return true; // El guardia levanta la barrera
    }
  }

  // 4. Si intentan hacer trampa o la ruta está vacía, se expulsa al Lobby.
  console.warn(`🛡️ [Guard] Acceso denegado a la lección ${idDestino}. Redirigiendo al Lobby.`);
  router.navigate(['/lobby']);
  return false;
};
