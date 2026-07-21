export interface OpcionRespuestaDTO {
  id: number;
  textoOpcion: string;
}

export interface LeccionCompletaDTO {
  id: number;
  titulo: string;
  problemaHook: string;
  metafora: string;
  pseudocodigo: string;
  codigoJava: string;
  opciones: OpcionRespuestaDTO[];
}
