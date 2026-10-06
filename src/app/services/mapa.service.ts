import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapaService {
  private http = inject(HttpClient);

  // Modifica esta URL según tu entorno en la nube
  private apiUrl = 'http://localhost:8080/api/mapa';

  obtenerRutaDelUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${usuarioId}`);
  }
}
