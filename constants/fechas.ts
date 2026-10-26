/* ============================================================
   Cálculos de fechas (funciones puras: no dependen de React)
   ============================================================ */

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/**
 * Identifica un mes como "2026-10" (el mes siempre con 2 dígitos).
 * Sirve para saber si algo ya se pagó en el mes actual: al cambiar de mes
 * la clave cambia sola y lo pagado vuelve a quedar pendiente.
 * Con 2 dígitos las claves se pueden comparar como texto ("2026-09" < "2026-10").
 */
export function claveMes(fecha: Date = new Date()): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

/** Clave del mes siguiente: de "2026-12" pasa a "2027-01" sin problemas. */
export function claveMesSiguiente(fecha: Date = new Date()): string {
  return claveMes(new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1));
}

/** Nombre del mes de una clave: "2026-11" -> "Noviembre". */
export function nombreMesDeClave(clave: string): string {
  return MESES[parseInt(clave.split('-')[1], 10) - 1];
}

/**
 * Día de vencimiento que realmente existe en un mes.
 * Si la tarjeta vence el 31 y el mes tiene 28 días, vence el 28.
 * (`mes` va de 0 a 11, igual que en Date)
 */
export function diaEfectivo(diaVencimiento: number, anio: number, mes: number): number {
  const ultimoDiaDelMes = new Date(anio, mes + 1, 0).getDate();
  return Math.min(diaVencimiento, ultimoDiaDelMes);
}

/**
 * ¿Ya pasó el día de corte de la tarjeta este mes?
 * La app maneja un solo día por tarjeta (facturación / vencimiento) y lo usa como corte:
 * una compra hecha después de ese día ya no entra en el estado de cuenta de este mes.
 */
export function pasoElCorte(diaVencimiento: number, hoy: Date = new Date()): boolean {
  return hoy.getDate() > diaEfectivo(diaVencimiento, hoy.getFullYear(), hoy.getMonth());
}

interface OpcionesVencimiento {
  pagada?: boolean;    // ¿Ya se pagó el mes en esta tarjeta?
  hayPagos?: boolean;  // ¿Hay algo por pagar este mes? (cuotas o suscripciones)
}

/**
 * Calcula el texto de vencimiento según el día de hoy.
 * Ejemplo: hoy es 10 y vence el 15 -> "Vence 15 de Octubre" + "Quedan 5 días".
 * Devuelve dos textos: `texto` (fecha) y `subtexto` (estado).
 *
 * Solo dice "Atrasada" si de verdad hay algo por pagar. Si el mes ya está pagado
 * o no hay pagos, muestra el próximo vencimiento en vez de una deuda que no existe.
 */
export function calcularEstadoVencimiento(
  diaVencimiento: number,
  opciones: OpcionesVencimiento = {},
  hoy: Date = new Date()
): { texto: string; subtexto: string } {
  const { pagada = false, hayPagos = true } = opciones;
  const diaHoy = hoy.getDate();
  // Si el día no existe este mes (ej: 31 en Febrero) se usa el último día del mes
  const dia = diaEfectivo(diaVencimiento, hoy.getFullYear(), hoy.getMonth());

  // Nada por pagar: mostramos cuándo vuelve a vencer
  if (pagada || !hayPagos) {
    // Pagada, o con el día ya pasado: el próximo vencimiento es el mes siguiente
    const mesSiguiente = pagada || diaHoy > dia;
    const destino = new Date(hoy.getFullYear(), hoy.getMonth() + (mesSiguiente ? 1 : 0), 1);
    const diaDestino = diaEfectivo(diaVencimiento, destino.getFullYear(), destino.getMonth());
    return {
      texto: `Próximo vencimiento ${diaDestino} de ${MESES[destino.getMonth()]}`,
      subtexto: pagada ? 'Pagada este mes' : 'Sin pagos este mes',
    };
  }

  const nombreMes = MESES[hoy.getMonth()]; // getMonth() devuelve 0-11
  const textoFecha = `${dia} de ${nombreMes}`;

  if (diaHoy < dia) {
    // Aún no vence: contamos los días que faltan
    const diff = dia - diaHoy;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Quedan ${diff} día${diff > 1 ? 's' : ''}`,
    };
  } else if (diaHoy === dia) {
    // Vence justo hoy
    return {
      texto: `Vence hoy (${textoFecha})`,
      subtexto: '¡Paga hoy!',
    };
  } else {
    // Ya pasó la fecha y quedan pagos pendientes: contamos los días de atraso
    const diff = diaHoy - dia;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Atrasada por ${diff} día${diff > 1 ? 's' : ''}`,
    };
  }
}

/**
 * Calcula cuándo es el próximo cobro de una suscripción.
 * - Si el día no existe en el mes (ej: 31 en Febrero) usa el último día del mes.
 * - `saltarMesActual` fuerza el mes siguiente (se usa cuando ya se pagó este mes).
 */
export function calcularProximoCobro(diaCobro: number, saltarMesActual: boolean = false) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ultimoDia = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const construir = (y: number, m: number) =>
    new Date(y, m, Math.min(diaCobro, ultimoDia(y, m)));

  let fecha = construir(hoy.getFullYear(), hoy.getMonth());
  if (saltarMesActual || fecha < hoy) {
    // Ya pasó (o ya se pagó) este mes: el cobro es el mes siguiente
    fecha = construir(hoy.getFullYear(), hoy.getMonth() + 1);
  }

  const dias = Math.round((fecha.getTime() - hoy.getTime()) / 86400000);
  return {
    texto: `${fecha.getDate()} de ${MESES[fecha.getMonth()]}`,
    dias,
    subtexto: dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : `En ${dias} días`,
  };
}
