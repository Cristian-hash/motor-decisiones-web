import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeccionService } from './services/leccion.service';
import { LeccionCompletaDTO } from './models/leccion.dto'; //1. importas la forma de la caja
import { RespuestaEstudianteDTO } from './models/evaluacion.dto';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-tesis');
  //2. Creas la "mesa vacia". Al principio, no hay leccion(undefined).
  leccionActual: LeccionCompletaDTO | undefined;

  constructor(private leccionService: LeccionService) {
    //3. Envias el mensajero y firmas la orden()
    this.leccionService.obtenerLeccion(1).subscribe({
      next: (datosQueLlegaron) => {
        //4. Magicamente,2 segundos depues,el mensajero vuelve.
        //Pones la comida en la mesa:
        this.leccionActual = datosQueLlegaron;
        console.log('!Los datos reales llegaron', this.leccionActual);
      },
      error: (error) => {
        console.error('El mensajero fracasó', error);
      },
    });
  }

  evaluarOpcion(idOpcionSeleccionada: number) {
    console.log('El usuario hizo clic en la opcion ID', idOpcionSeleccionada);
    const paqueteDeRespuesta: RespuestaEstudianteDTO = {
      usuarioId: 1,
      leccionId: this.leccionActual?.id || 1,
      opcionSeleccionadaId: idOpcionSeleccionada,
    };

    this.leccionService.enviarRespuesta(paqueteDeRespuesta).subscribe({
      next: (feedbackDelBackend) => {
        console.log('¡El Chef evaluo la respuesta!', feedbackDelBackend);
        alert(feedbackDelBackend.mensajeJustificacion);
      },
      error: (error) => {
        console.error('Error al evaluar la respuesta', error);
      },
    });
  }
}
