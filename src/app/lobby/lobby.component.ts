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

  // PASO 1: EL DESPERTAR (Cuando la pantalla carga)
  ngOnInit() {
    this.consultarMapaAlBackend();
  }

  // PASO 2: LA ELECCIÓN (Cuando haces clic en un círculo)
  entrarAlNivel(nivel: any) {
    if (nivel.estado === 'BLOQUEADO') {
      return;
    }

    // 1. LA LUPA: Imprimimos el objeto exacto recibido del servidor
    console.log('🔍 [Lobby] Datos del nivel recibidos de Spring Boot:', nivel);

    this.prepararMochilaParaElViaje(nivel);
    this.viajarALaPrimeraEstacion(nivel);
  }

  // --- HERRAMIENTAS INTERNAS DEL ARQUITECTO (Métodos Privados) ---

  private consultarMapaAlBackend() {
    const usuarioId = this.obtenerIdUsuarioDesdeToken();

    this.mapaService.obtenerRutaDelUsuario(usuarioId).subscribe({
      next: (mapaDesdeBackend) => {
        this.niveles = mapaDesdeBackend;
        console.log('✅ [Lobby] Mapa cargado con éxito');
      },
      error: (err) => console.error('Error cargando el mapa', err),
    });
  }

  private prepararMochilaParaElViaje(nivel: any) {
    // Extraemos la ruta enviada por Spring Boot
    const ruta = nivel.rutaIds || nivel.rutaLecciones || [];

    // Guardamos la hoja de ruta para que el LeccionComponent la lea después
    localStorage.setItem('rutaNivel', JSON.stringify(ruta));

    // Limpiamos la memoria para evitar mezclar errores de partidas anteriores
    localStorage.removeItem('faseRepeticion');
    localStorage.removeItem('colaFalladas');
    localStorage.removeItem('leccionActual');
  }

  private viajarALaPrimeraEstacion(nivel: any) {
    const ruta = nivel.rutaIds || nivel.rutaLecciones || [];

    // 2. LA LUPA: Verificamos qué números extrajo Angular
    console.log('🗺️ [Lobby] Arreglo de rutas extraído:', ruta);

    if (ruta.length > 0) {
      const primeraLeccionSegura = ruta[0];
      console.log(`🚀 [Lobby] Viajando a la lección ID: ${primeraLeccionSegura}`);
      this.router.navigate(['/leccion', primeraLeccionSegura]);
    } else {
      console.error('❌ [Lobby] Arreglo de rutas vacío. Angular carece de destino.');
    }
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
