export interface RespuestaEstudianteDTO {
  usuarioId: number;
  leccionId: number;
  opcionSeleccionadaId: number;
}

export interface FeedbackDTO {
  esCorrecto: boolean;
  mensajeJustificacion: string;
  puntosObtenidis: number;
  consejoSiguienteNivel: string;
}
