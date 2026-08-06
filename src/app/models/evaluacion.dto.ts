export interface RespuestaEstudianteDTO {
  usuarioId: number;
  leccionId: number;
  opcionSeleccionadaId: number;
}

export interface FeedbackDTO {
  esCorrecto: boolean;
  mensajeJustificacion: string;
  puntosObtenidos: number;
  consejoSiguienteNivel: string;
}
