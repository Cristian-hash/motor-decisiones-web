import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeccionCompletaDTO } from '../../models/leccion.dto';
import { RespuestaEstudianteDTO } from '../../models/evaluacion.dto';
import { LeccionService } from '../../services/leccion.service';

@Component({
  selector: 'app-leccion',
  imports: [],
  templateUrl: './leccion.component.html',
  styleUrl: './leccion.component.css',
})
export class LeccionComponent implements OnInit {
  leccionActual: LeccionCompletaDTO | undefined;

  // --- BANDERAS DE LA INTERFAZ ---
  mostrarFeedBack: boolean = false;
  esCorrecto: boolean = false;
  mensajeFeedback: string = '';
  tituloFeedback: string = '';
  puntosGanados: number = 0;

  // --- EXPERTOS CONTRATADOS ---
  private router = inject(Router);
  private route = inject(ActivatedRoute); // El vigía de la URL
  private leccionService = inject(LeccionService);

  // El constructor queda completamente limpio. Solo prepara herramientas.
  constructor() {}

  ngOnInit() {
    // LA MAGIA DEL OBSERVER: Suscribimos la campanita a la URL
    this.route.paramMap.subscribe({
      next: (parametrosUrl) => {
        // Extraemos el identificador fresco apenas la URL cambie
        const idAtrapado = Number(parametrosUrl.get('id'));

        console.log(` [Frontend] URL cambió. Pidiendo Lección ${idAtrapado}...`);

        // Ejecutamos la petición delegando el trabajo pesado
        this.pedirLeccionAlBackend(idAtrapado);
      },
    });
  }

  // Lógica pesada separada para mantener orden
  pedirLeccionAlBackend(idLeccion: number) {
    this.leccionService.obtenerLeccion(idLeccion).subscribe({
      next: (datosQueLlegaron) => {
        this.leccionActual = datosQueLlegaron;
        // Bajamos la bandera visual para iniciar con la pantalla limpia
        this.mostrarFeedBack = false;
        console.log('✅ [Frontend] ¡Lección cargada!', this.leccionActual);
      },
      error: (error) => {
        console.error('❌ [Frontend] Error al cargar la lección:', error);
      },
    });
  }

  evaluarOpcion(idOpcionSeleccionada: number) {
    const paqueteDeRespuesta: RespuestaEstudianteDTO = {
      usuarioId: 1,
      leccionId: this.leccionActual?.id || 1,
      opcionSeleccionadaId: idOpcionSeleccionada,
    };

    this.leccionService.enviarRespuesta(paqueteDeRespuesta).subscribe({
      next: (feedback) => {
        this.esCorrecto = feedback.esCorrecto;
        this.mensajeFeedback = feedback.mensajeJustificacion;
        this.puntosGanados = feedback.puntosObtenidos;

        // El orquestador decide el texto exacto
        this.tituloFeedback = feedback.esCorrecto ? '¡Excelente decisión!' : 'Decisión incorrecta';

        this.mostrarFeedBack = true;
      },
      error: (err) => {
        // Evaluamos el rechazo del backend
        if (err.status === 409) {
          this.esCorrecto = false;
          this.tituloFeedback = 'Aviso del Sistema';
          this.mensajeFeedback =
            'Ya has completado esta lección anteriormente. ¡Avanza al siguiente desafío!';
          this.mostrarFeedBack = true;
        } else {
          this.esCorrecto = false;
          this.tituloFeedback = 'Error de conexión';
          this.mensajeFeedback = 'Ocurrió un problema de conexión con el Motor de Decisiones.';
          this.mostrarFeedBack = true;
        }
      },
    });
  }

  avanzarSiguienteLeccion() {
    // Calculamos el siguiente destino y llamamos al recepcionista
    const siguienteId = (this.leccionActual?.id || 0) + 1;
    this.router.navigate(['/leccion', siguienteId]);
  }
}
