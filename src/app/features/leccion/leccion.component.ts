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

  // --- MÁQUINA DE ESTADOS VISUAL ---
  faseActual: 'PREGUNTA' | 'EVALUANDO' | 'FEEDBACK' | 'COMPLETADO' = 'PREGUNTA';
  opcionSeleccionadaId: number | null = null;

  // --- BANDERAS DE LA INTERFAZ ---
  mostrarFeedBack: boolean = false;
  esCorrecto: boolean = false;
  yaCompletada: boolean = false;
  mensajeFeedback: string = '';
  textoOpcionCorrecta: string = '';
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
    this.faseActual = 'PREGUNTA';
    this.opcionSeleccionadaId = null;
    this.yaCompletada = false;

    this.leccionService.obtenerLeccion(idLeccion).subscribe({
      next: (datosQueLlegaron) => {
        this.leccionActual = datosQueLlegaron;
        // Bajamos la bandera visual para iniciar con la pantalla limpia
        // this.mostrarFeedBack = false;

        console.log('✅ [Frontend] ¡Lección cargada!', this.leccionActual);
      },
      error: (error) => {
        console.error('❌ [Frontend] Error al cargar la lección:', error);
      },
    });
  }

  evaluarOpcion(idOpcionSeleccionada: number) {
    const token = localStorage.getItem('token');
    let usuarioDinamico = 1; //Plan de emerigencia popr si algo falla

    if (token) {
      try {
        //1
        const payloadBase64 = token.split('.')[1];
        const payloadDecodigicado = JSON.parse(atob(payloadBase64));
        usuarioDinamico = payloadDecodigicado.id;
      } catch (error) {
        console.error('Error abriendo el pasaporte JWT:', error);
      }
    }

    const paqueteDeRespuesta: RespuestaEstudianteDTO = {
      usuarioId: usuarioDinamico,
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
          this.tituloFeedback = '¡Nivel ya dominado!';
          this.mensajeFeedback =
            err.error?.message ||
            'Tu historial demuestra que superaste este reto con anterioridad. Usa tu tiempo estratégicamente y avanza hacia nuevos conocimientos.';
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

  // 1. SELECCIONAR (Solo visual)
  seleccionarOpcion(idOpcion: number) {
    if (this.faseActual !== 'PREGUNTA') return; // Bloquea cambios si ya evaluó
    this.opcionSeleccionadaId = idOpcion;
  }

  // 2. COMPROBAR (Habla con el backend)
  comprobarRespuesta() {
    if (!this.opcionSeleccionadaId || this.faseActual !== 'PREGUNTA') return;

    this.faseActual = 'EVALUANDO'; // Bloquea doble clic

    const token = localStorage.getItem('token');
    let usuarioDinamico = 1;
    if (token) {
      try {
        usuarioDinamico = JSON.parse(atob(token.split('.')[1])).id;
      } catch (e) {}
    }

    const paquete: RespuestaEstudianteDTO = {
      usuarioId: usuarioDinamico,
      leccionId: this.leccionActual?.id || 1,
      opcionSeleccionadaId: this.opcionSeleccionadaId,
    };

    this.leccionService.enviarRespuesta(paquete).subscribe({
      next: (feedback) => {
        this.esCorrecto = feedback.esCorrecto;
        this.mensajeFeedback = feedback.mensajeJustificacion;
        this.puntosGanados = feedback.puntosObtenidos;

        // Si el backend dictamina que es incorrecto, guardamos el ID para repetir
        if (this.esCorrecto) {
          this.tituloFeedback = '¡Buen trabajo!';
        } else {
          this.tituloFeedback = 'Solución correcta:';
          //this.textoOpcionCorrecta = feedback.textoOpcionCorrecta || 'Opción correcta no recibida';
          this.agregarAColaDeFalladas(paquete.leccionId);
        }

        this.faseActual = 'FEEDBACK';
      },
      error: (err) => {
        this.faseActual = 'FEEDBACK';
        if (err.status === 409) {
          this.esCorrecto = false;
          this.yaCompletada = true;
          this.tituloFeedback = '¡Atención!';

          // OBSERVACIÓN: Angular ahora es inteligente y lee exactamente la llave "mensaje" de tu DTO
          this.mensajeFeedback =
            err.error?.mensaje || 'Tu historial demuestra que superaste este reto.';
        } else {
          this.tituloFeedback = 'Error de conexión';
          this.mensajeFeedback = 'Ocurrió un problema de conexión con el Motor de Decisiones.';
        }
      },
    });
  }

  // 3. SALTAR (Envía a la cola sin evaluar)
  saltar() {
    if (this.leccionActual) {
      this.agregarAColaDeFalladas(this.leccionActual.id);
    }
    this.ejecutarNavegacion(this.obtenerSiguienteDestino());
  }

  // 4. CONTINUAR (Calcula el siguiente paso estratégico)
  continuar() {
    const siguienteId = this.obtenerSiguienteDestino();
    if (siguienteId === 0) {
      this.faseActual = 'COMPLETADO';
    } else {
      this.ejecutarNavegacion(siguienteId);
    }
  }

  irAlLobby() {
    localStorage.removeItem('leccionActual');
    localStorage.removeItem('colaFalladas');
    localStorage.removeItem('faseRepeticion');
    this.router.navigate(['/lobby']);
  }

  // --- LÓGICA DE LA COLA DE APRENDIZAJE ---
  private agregarAColaDeFalladas(id: number) {
    let cola = JSON.parse(localStorage.getItem('colaFalladas') || '[]');
    if (!cola.includes(id)) {
      cola.push(id);
      localStorage.setItem('colaFalladas', JSON.stringify(cola));
    }
  }
  private obtenerSiguienteDestino(): number {
    const idActual = Number(this.route.snapshot.paramMap.get('id'));
    const MAX_LECCIONES = 5; // Ajusta este número al total real de tus lecciones base

    // 1. Consultamos el Macro-Estado: ¿Ya terminamos la primera vuelta?
    const enFaseRepeticion = localStorage.getItem('faseRepeticion') === 'true';

    // 2. Si estamos en la primera vuelta y no es la última lección, avanzamos normal (+1)
    if (!enFaseRepeticion && idActual < MAX_LECCIONES) {
      return idActual + 1;
    }

    // 3. Si acabamos de procesar la última lección original, encendemos el Macro-Estado de repetición
    if (idActual === MAX_LECCIONES && !enFaseRepeticion) {
      localStorage.setItem('faseRepeticion', 'true');
    }

    // 4. MODO REPETICIÓN: Ignoramos la matemática y delegamos el destino a la cola
    let cola: number[] = JSON.parse(localStorage.getItem('colaFalladas') || '[]');

    if (cola.length > 0) {
      // Extraemos el primer ID fallido de la fila (ej. saca el 2, la próxima vez sacará el 4)
      const siguienteIdFallo = cola.shift()!;
      localStorage.setItem('colaFalladas', JSON.stringify(cola));
      return siguienteIdFallo;
    } else {
      // Victoria absoluta: La cola está vacía. Limpiamos el estado para futuras sesiones.
      localStorage.removeItem('faseRepeticion');
      return 0; // Desencadena el viaje al Dashboard
    }
  }
  private ejecutarNavegacion(siguienteId: number) {
    if (siguienteId === 0) {
      this.router.navigate(['/dashboard']); // Fin total
    } else {
      localStorage.setItem('leccionActual', siguienteId.toString());
      this.router.navigate(['/leccion', siguienteId]);
    }
  }

  avanzarSiguienteLeccion() {
    // 1. Observo: Buscamos la verdad absoluta en la URL actual, no en el DTO
    const idActualEnUrl = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Comprendo: Calculamos matemáticamente el siguiente paso
    const siguienteId = idActualEnUrl + 1;
    console.log(`[Arquitectura] Avanzando de lección ${idActualEnUrl} a ${siguienteId}`);

    // 3. Corrijo: Sellamos la memoria del navegador ANTES de pedir el viaje
    localStorage.setItem('leccionActual', siguienteId.toString());

    // 4. Avanzo: Ordenamos al orquestador visual que ejecute el cambio de pantalla
    this.router.navigate(['/leccion', siguienteId]).then((viajeExitoso) => {
      console.log(`[Frontend] ¿El Guardia permitió el paso?: ${viajeExitoso}`);
    });
  }
}
