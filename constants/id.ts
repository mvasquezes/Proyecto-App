/**
 * Genera un identificador único.
 * Date.now() solo podía repetirse si se creaban dos cosas en el mismo milisegundo;
 * el sufijo aleatorio elimina ese riesgo sin instalar librerías.
 */
export const generarId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
