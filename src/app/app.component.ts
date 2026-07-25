import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeccionService } from './services/leccion.service';
import { LeccionCompletaDTO } from './models/leccion.dto';
import { RespuestaEstudianteDTO } from './models/evaluacion.dto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-tesis');

  // 1. LA MESA VACÍA: Creamos una variable para guardar la lección,
  // pero al principio arranca en "undefined" (vacía).
  leccionActual: LeccionCompletaDTO | undefined;

  // 2. INYECTAR EL SERVICIO: Contratamos al mesero (LeccionService).
  constructor(private leccionService: LeccionService) {
    console.log('📡 [Frontend] Pidiendo la Lección 1 a Spring Boot...');

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
    console.log('👉 [Frontend] El usuario eligió la opción ID:', idOpcionSeleccionada);

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
        alert(feedback.mensajeJustificacion); // Muestra un popup simple con el resultado
      },
      error: (err) => {
        console.error('❌ [Frontend] Error al evaluar:', err);
      },
    });
  }
}
