/* ============================================================
   Cálculo de cuotas (funciones puras: no dependen de React)

   Problema que resuelven: al dividir un monto en cuotas casi nunca sale exacto.
   Ej: $100.000 en 3 cuotas. Si cada cuota se redondea (33.333 x 3) la suma da
   $99.999 y la app terminaba "perdiendo" un peso (o regalándolo, según el redondeo).

   Solución: las cuotas 1 a N-1 valen lo mismo (monto / cuotas, hacia abajo) y la
   ÚLTIMA cuota absorbe la diferencia. Así la suma siempre da exactamente el monto.
   Ej: $100.000 en 3 -> $33.333 + $33.333 + $33.334.
   ============================================================ */

/** Los datos mínimos de una compra en cuotas que necesitan estas funciones. */
export interface DatosCuotas {
  montoTotal: number;
  totalCuotas: number;
  cuotaMensual: number; // Valor de las cuotas 1 a N-1 (ver calcularCuotaBase)
}

/** Valor de las cuotas "normales": el monto dividido en cuotas, redondeado hacia abajo. */
export function calcularCuotaBase(montoTotal: number, totalCuotas: number): number {
  return Math.floor(montoTotal / totalCuotas);
}

/**
 * Cuánto se paga en una cuota concreta (1 a N).
 * Todas valen `cuotaMensual`, excepto la última, que completa el monto total.
 */
export function montoDeCuota(tx: DatosCuotas, numeroCuota: number): number {
  if (numeroCuota >= tx.totalCuotas) {
    return tx.montoTotal - tx.cuotaMensual * (tx.totalCuotas - 1);
  }
  return tx.cuotaMensual;
}

/**
 * Lo que todavía falta pagar de una compra, incluida la cuota actual.
 * Las cuotas ya pagadas (1 a cuotaActual-1) siempre son "normales", por eso
 * basta restarlas del total: el resultado es exacto, sin errores de redondeo.
 * Es lo que "ocupa" cupo en la tarjeta.
 */
export function saldoPendienteTx(tx: DatosCuotas & { cuotaActual: number }): number {
  return tx.montoTotal - tx.cuotaMensual * (tx.cuotaActual - 1);
}
