import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LeccionService } from './services/leccion.service';
import { LeccionCompletaDTO } from './models/leccion.dto';
import { RespuestaEstudianteDTO } from './models/evaluacion.dto';
import { AuthService } from './core/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-tesis');

  //2.Inyectado y publico para el HTML
  public authService = inject(AuthService);

  // 1. LA MESA VACÍA: Creamos una variable para guardar la lección,
  // pero al principio arranca en "undefined" (vacía).
  leccionActual: LeccionCompletaDTO | undefined;
  // --- BANDERAS DE LA INTERFAZ(Feedback) ---
  mostrarFeedBack: boolean = false;
  esCorrecto: boolean = false;
  mensajeFeedback: string = '';
  puntosGanados: number = 0;

  // 2. INYECTAR EL SERVICIO: Contratamos al mesero (LeccionService).
  constructor(private leccionService: LeccionService) {
    console.log(' [Frontend] Pidiendo la Lección 1 a Spring Boot...');

    // 3. LA LLAMADA: Le pedimos al mesero que traiga la lección con ID 1.
    this.leccionService.obtenerLeccion(1).subscribe({
      next: (datosQueLlegaron) => {
        // 4. ¡LLEGARON LOS DATOS!: Ponemos el DTO real sobre la "mesa".
        this.leccionActual = datosQueLlegaron;
        console.log('✅ [Frontend] ¡Lección cargada!', this.leccionActual);
      },
      error: (error) => {
        console.error('❌ [Frontend] Error al cargar la lección:', error);
      },
    });
  }

  // 5. ESCUCHAR EL CLICK: Cuando el usuario toque un botón en el HTML...
  evaluarOpcion(idOpcionSeleccionada: number) {
    console.log(' [Frontend] El usuario eligió la opción ID:', idOpcionSeleccionada);

    // 6. EMPAQUETAR DTO: Armamos la respuesta para enviarla a evaluar.
    const paqueteDeRespuesta: RespuestaEstudianteDTO = {
      usuarioId: 1, // Por ahora quemado, luego vendrá del Login JWT
      leccionId: this.leccionActual?.id || 1, // El escudo ?. protege por si acaso
      opcionSeleccionadaId: idOpcionSeleccionada,
    };

    // 7. ENVIAR A EVALUAR: Le pasamos la respuesta al Motor de Decisiones
    this.leccionService.enviarRespuesta(paqueteDeRespuesta).subscribe({
      next: (feedback) => {
        console.log('✅ [Backend dice]:', feedback);

        // 1. Levantamos las banderas con los datos del servidor

        this.esCorrecto = feedback.esCorrecto;
        this.mensajeFeedback = feedback.mensajeJustificacion;
        this.puntosGanados = feedback.puntosObtenidis;

        //2. Le damos la orden final al HTML para que aparezca
        this.mostrarFeedBack = true;

        //3. (OPCIONAL /EXTRA)   aCTUALIZAR LA PIZARRA GLOBAL DE PUNTOS si la tienes
      },
      error: (err) => {
        console.error('❌ [Frontend] Error al evaluar:', err);
      },
    });
  }
}
