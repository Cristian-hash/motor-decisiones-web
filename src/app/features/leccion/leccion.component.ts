import { Component } from '@angular/core';
import { LeccionCompletaDTO } from '../../models/leccion.dto';
import { RespuestaEstudianteDTO } from '../../models/evaluacion.dto';
import { LeccionService } from '../../services/leccion.service';
@Component({
  selector: 'app-leccion',
  imports: [],
  templateUrl: './leccion.component.html',
  styleUrl: './leccion.component.css',
})
export class LeccionComponent {
  leccionActual: LeccionCompletaDTO | undefined;

  // --- BANDERAS DE LA INTERFAZ(Feedback) ---
  mostrarFeedBack: boolean = false;
  esCorrecto: boolean = false;
  mensajeFeedback: string = '';
  puntosGanados: number = 0;
  tituloFeedback: string = '';

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
        this.tituloFeedback = feedback.esCorrecto ? '¡Excelente decisión!' : 'Decisión incorrecta';
        //2. Le damos la orden final al HTML para que aparezca
        this.mostrarFeedBack = true;

        //3. (OPCIONAL /EXTRA)   ACTUALIZAR LA PIZARRA GLOBAL DE PUNTOS si la tienes
      },
      error: (err) => {
        // 1. Imprimimos el error oculto para nosotros los desarrolladores
        console.error('❌ [Frontend] Error al evaluar:', err);
        // 2. Analizamos qué tipo de error devolvió el Faraón
        if (err.status == 409) {
          // Si es 409 (Conflicto/Duplicado), levantamos banderas con un mensaje claro
          this.esCorrecto = false;
          this.tituloFeedback = 'Aviso del Sistema';
          this.mensajeFeedback =
            'Ya has completado esta leccíón anteriomente. ¡Avanza a la siguiente pregunta!';
          this.mostrarFeedBack = true;
        } else {
          // Si es cualquier otro error (ej. se cayó el servidor - 500)
          this.esCorrecto = false;
          this.mensajeFeedback = 'Ocurrio un problema de conexion con el motor de Desiciones';
          this.mostrarFeedBack = true;
        }
      },
    });
  }
}
