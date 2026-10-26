/**
 * Rutas de la app. Coinciden con los nombres de archivo dentro de app/
 * (expo-router usa el nombre del archivo como ruta, mayúsculas incluidas).
 *
 * Centralizarlas evita errores de tipeo y permite renombrar una pantalla
 * cambiando un solo lugar.
 */
export const RUTAS = {
  inicio: '/',
  tarjetas: '/Tarjetas',
  registrarTarjeta: '/RegistrarTarjeta',
  registrarTransaccion: '/RegistrarTransaccion',
  suscripciones: '/Suscripciones',
  registrarSuscripcion: '/RegistrarSuscripcion',
  // Ruta dinámica: app/detalle-tarjeta/[id].tsx
  detalleTarjeta: (id: string) => `/detalle-tarjeta/${id}` as const,
} as const;
