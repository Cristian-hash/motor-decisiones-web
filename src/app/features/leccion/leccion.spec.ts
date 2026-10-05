import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapaService } from '../../services/mapa.service'; // Tu nuevo mensajero HTTP

@Component({
  selector: 'app-lobby',
  standalone: true,
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css'],
})
export class LobbyComponent implements OnInit {
  private router = inject(Router);
  private mapaService = inject(MapaService);

  // Empezamos con una lista vacía. Angular dibujará un "Cargando..."
  niveles: any[] = [];

  // EL PRIMER SUSPIRO DEL COMPONENTE
  ngOnInit() {
    const usuarioId = this.obtenerIdUsuarioDesdeToken(); // Tu lógica de JWT

    // Delegamos la búsqueda al servicio y nos suscribimos a la respuesta
    this.mapaService.obtenerRutaDelUsuario(usuarioId).subscribe({
      next: (mapaDesdeBackend) => {
        this.niveles = mapaDesdeBackend; // ¡El mapa cobra vida con datos reales!
        console.log('✅ [Lobby] Mapa cargado con éxito');
      },
      error: (err) => console.error('❌ Error cargando el mapa', err),
    });
  }

  entrarAlNivel(nivel: any) {
    if (nivel.estado === 'BLOQUEADO') return;

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
    return 1; // Respaldo de emergencia
  }
}
