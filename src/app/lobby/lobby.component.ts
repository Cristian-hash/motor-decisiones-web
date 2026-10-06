import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapaService } from '../services/mapa.service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  private router = inject(Router);
  private mapaService = inject(MapaService);

  niveles: any[] = [];

  ngOnInit() {
    const usuarioId = this.obtenerIdUsuarioDesdeToken();

    this.mapaService.obtenerRutaDelUsuario(usuarioId).subscribe({
      next: (mapaDesdeBackend) => {
        this.niveles = mapaDesdeBackend;
        console.log('✅ [Lobby] Mapa cargado con éxito');
      },
      error: (err) => console.error('Error cargando el mapa', err),
    });
  }

  entrarAlNivel(nivel: any) {
    if (nivel.estado === 'BLOQUEADO') {
      return; // Evitamos avanzar
    }

    localStorage.removeItem('faseRepeticion');
    localStorage.removeItem('colaFalladas');
    localStorage.removeItem('leccionActual');
    this.router.navigate(['/leccion', nivel.leccionInicialId]);
  }

  private obtenerIdUsuarioDesdeToken(): number {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1])).id;
      } catch (e) {}
    }
    return 1;
  }
}
