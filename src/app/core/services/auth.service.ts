import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequestDTO, AuthResponseDTO } from '../../models/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //La direccion de tu Spring Boot
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  //NUESTRA PIZARRA CENTRAL (signal)
  //Guardaremos el token aqui para que toda la app sepa si hay alguien conectado.
  // Inicia leyendo el localStorage por si el usuario recargo la pagina(F5)
  tokenActual = signal<string | null>(localStorage.getItem('token'));
  constructor(private http: HttpClient) {}

  iniciarSesion(credenciales: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credenciales).pipe(
      // 4. EL GUARDIA GUARDA EL PASE VIP EN TU BOLSILLO
      tap((respuesta) => {
        // 1. Guardamos la llave en el bolsillo del navegador
        localStorage.setItem('token', respuesta.token);
        // 2. Escribimos en la Pizarra Central
        this.tokenActual.set(respuesta.token);
      }),
    );
  }

  cerrarSesion() {
    //1. Borramos la llave del bolsillo
    localStorage.removeItem('token');
    //2. Borramos la Pizarra (tocamos la campana avisando que ya no hay usuario)
    this.tokenActual.set(null);
  } // Fin de la clase
}
