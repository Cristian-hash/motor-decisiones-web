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
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}/login`, credenciales).pipe();
  }
}
