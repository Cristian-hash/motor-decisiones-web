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
  // Solo pedimos el "teléfono" (HttpClient). La centralita ya le conectó el brazo robótico.
  constructor(private http: HttpClient) {}

  //Retorna una promesa(Observable)deque entregara la caja con la Lección
  obtenerLeccion(id: number): Observable<LeccionCompletaDTO> {
    return this.http.get<LeccionCompletaDTO>(`${this.apiUrl}/${id}`);
  }
  //NUEVO METODO : Toma la respuesta del alumno y la lanza al backend
  enviarRespuesta(respuesta: RespuestaEstudianteDTO): Observable<FeedbackDTO> {
    return this.http.post<FeedbackDTO>(this.evaluacionUrl, respuesta);
  }
}
