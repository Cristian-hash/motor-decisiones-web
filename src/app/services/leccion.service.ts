import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeccionCompletaDTO } from '../models/leccion.dto';
import { RespuestaEstudianteDTO, FeedbackDTO } from '../models/evaluacion.dto';
@Injectable({
  providedIn: 'root',
})
export class LeccionService {
  // La direccion del Banco(Tu Stirng Boot)
  private apiUrl = 'http://localhost:8080/api/v1/lecciones';

  private evaluacionUrl = 'http://localhost:8080/api/v1/evaluaciones/decidir';
  //Le inyectamos el telefono al mensajero en el constructor
  constructor(private http: HttpClient) {}

  //Retorna una promesa(Observable)deque entregara la caja con la Lección
  obtenerLeccion(id: number): Observable<LeccionCompletaDTO> {
    return this.http.get<LeccionCompletaDTO>(`${this.apiUrl}/${id}`);
  }
  //NUEVO METODO : Toma la respuesta del alumno y la lanza al backend
  envarRespuesta(respuesta: RespuestaEstudianteDTO): Observable<FeedbackDTO> {
    return this.http.post<FeedbackDTO>(this.evaluacionUrl, respuesta);
  }
}
