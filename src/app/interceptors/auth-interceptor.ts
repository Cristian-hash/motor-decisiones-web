import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //1.EL BRAZO ROBOTICO BUSCA LA CAJA FUERTE
  //'localStorage' es el almacen del navegador. Buscamos la llave 'token'.
  // Pongo este log afuera para saber si el archivo fue invocado
  console.log('🦾 Brazo Robótico encendido. Revisando al mensajero...');
  const token = localStorage.getItem('token');

  // 2. TOMA DE DECISIÓN (Sin hacer un 'return' prematuro antes de evaluar)
  if (token) {
    // Clonamos al mensajero porque la petición original es inmutable
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('🛡️Brazo Robótico: Gafete pegado al mensajero.');
    // Le abrimos la puerta para que salga con el nuevo casco
    return next(peticionClonada);
  }
  //3. SI NO HAY TOKEN (Ej. Alguien no logueado)
  console.log('⚠️ Brazo Robotico: Mensajero sale sin Gafete (No hay token).');
  // Dejamos que salga tal cual, sin alterar nada
  return next(req);
};
