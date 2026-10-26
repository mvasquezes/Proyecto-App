import React, { createContext, ReactNode, useContext, useState } from 'react';
import { calcularCuotaBase, montoDeCuota, saldoPendienteTx } from '../constants/cuotas';
import {
  calcularEstadoVencimiento,
  calcularProximoCobro,
  claveMes,
  claveMesSiguiente,
  pasoElCorte,
} from '../constants/fechas';
import { formatearCLP } from '../constants/formato';
import { generarId } from '../constants/id';

/* ============================================================
   TIPOS (definen la "forma" de los datos de la app)
   ============================================================ */

/**
 * Una compra / cargo registrado en una tarjeta.
 * Se guarda tal cual en el estado `transacciones`.
 */
export interface TransaccionItem {
  id: string;            // Identificador único
  tarjetaId: string;     // A qué tarjeta pertenece (coincide con TarjetaItem.id)
  motivo: string;        // Descripción de la compra (ej: "Ropa Ripley")
  montoTotal: number;    // Monto completo de la compra
  cuotaMensual: number;  // Valor de las cuotas 1 a N-1 (montoTotal / totalCuotas, hacia abajo).
                         // La última cuota absorbe la diferencia: ver utils/cuotas.ts
  cuotaActual: number;   // Cuota que se está pagando ahora (empieza en 1)
  totalCuotas: number;   // Cantidad total de cuotas
  mesInicio: string;     // Mes en que se cobra la cuota 1 ("2026-10"). Si la compra se hizo
                         // después del corte de la tarjeta, es el mes siguiente
}

/**
 * Tarjeta lista para mostrar en pantalla.
 * Incluye datos guardados por el usuario + datos CALCULADOS
 * (monto del mes, texto de vencimiento, cupo disponible).
 * Es lo que reciben TarjetaGrande y TarjetaMini.
 */
export interface TarjetaItem {
  id: string;
  nombre: string;             // Título que se ve en la tarjeta
  alias: string;              // Nombre interno (obligatorio en Visa/MasterCard)
  banco: string;
  diaVencimiento: number;     // Día del mes (1 a 31)
  vencimiento: string;        // Texto calculado: "Vence 15 de Octubre (Quedan 3 días)"
  colorHex: string;           // Color de la tarjeta
  montoNumerico: number;      // Total a pagar este mes: cuotas + suscripciones pendientes (número, para sumar)
  monto: string;              // Mismo total pero formateado: "$10.000"
  estadoVencimiento: string;  // Solo el subtexto: "Quedan 3 días" / "Atrasada..."
  cupoTotal: number;          // Cupo asignado al crear la tarjeta
  cupoDisponible: number;     // Cupo que aún se puede usar (calculado)
  pagadaEsteMes: boolean;     // Calculado: true si ya se registró el pago del mes actual
}

/**
 * Datos que SÍ se guardan de una tarjeta (lo que el usuario escribe).
 * Los demás campos de TarjetaItem se calculan en el provider,
 * por eso no se guardan aquí: así nunca quedan desactualizados.
 */
interface TarjetaBase {
  id: string;
  nombre: string;
  alias: string;
  banco: string;
  diaVencimiento: number;
  colorHex: string;
  cupoTotal: number;
  ultimoMesPagado?: string; // Mes del último pago ("2026-10"): impide pagar dos veces el mismo mes
}

/**
 * Suscripción lista para mostrar (datos guardados + datos calculados).
 */
export interface SuscripcionItem {
  id: string;
  nombre: string;          // "Netflix"
  plan: string;            // "Plan Premium"
  monto: number;           // Cobro mensual
  diaCobro: number;        // Calculado: día de vencimiento de la tarjeta asociada
  proximoCobro: string;    // Calculado: "15 de Noviembre"
  diasRestantes: number;   // Calculado: días hasta el próximo cobro
  textoRestante: string;   // Calculado: "Hoy" / "Mañana" / "En 5 días"
  pagadaEsteMes: boolean;  // Calculado: true si ya se pagó en el mes actual
  tarjetaId: string;       // Tarjeta a la que está asociada
  tarjetaBanco: string;    // Calculado: nombre de esa tarjeta
  tarjetaColor: string;    // Calculado: color de esa tarjeta
}

/** Lo que realmente se guarda de una suscripción. */
interface SuscripcionBase {
  id: string;
  nombre: string;
  plan: string;
  monto: number;
  // El día de cobro no se guarda: siempre es el día de vencimiento de la tarjeta
  ultimoMesPagado?: string; // Mes del último pago ("2026-10"). Al cambiar de mes vuelve a quedar pendiente
  tarjetaId: string;        // Obligatoria: toda suscripción pertenece a una tarjeta
}

/** Resultado de intentar registrar una suscripción. */
export type ResultadoSuscripcion = 'ok' | 'sin_tarjeta' | 'sin_cupo';

/**
 * Todo lo que el contexto expone a las pantallas.
 * Se accede con: const { tarjetas, agregarTarjeta } = useApp();
 */
interface AppContextType {
  tarjetas: TarjetaItem[];              // Lista de tarjetas con datos calculados
  transacciones: TransaccionItem[];     // Lista de todas las compras
  suscripciones: SuscripcionItem[];     // Ordenadas por próximo cobro
  totalConsolidado: number;             // Suma a pagar este mes entre todas las tarjetas
  totalSuscripciones: number;           // Suma mensual de todas las suscripciones activas

  agregarTarjeta: (tarjeta: TarjetaBase) => void;
  // Devuelve true si se registró, false si se rechazó (ej: supera el cupo)
  registrarTransaccion: (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ) => boolean;
  // No guarda nada si la tarjeta no existe ('sin_tarjeta') o si el monto supera su cupo ('sin_cupo')
  agregarSuscripcion: (s: SuscripcionBase) => ResultadoSuscripcion;
  eliminarSuscripcion: (id: string) => void;
  // Devuelve false (y no cambia nada) si la tarjeta no existe o el mes ya estaba pagado
  pagarMesTarjeta: (tarjetaId: string) => boolean;
}

// El contexto parte como `undefined`; useApp() valida que exista un Provider.
const AppContext = createContext<AppContextType | undefined>(undefined);

/* ============================================================
   PROVIDER (guarda el estado global y las funciones)
   ============================================================ */

export function AppProvider({ children }: { children: ReactNode }) {
  /* ---------- ESTADO ----------
     Solo se guarda lo que el usuario escribe. Todo lo demás se calcula abajo. */

  // Tarjetas tal como las guardó el usuario (sin datos calculados).
  const [tarjetasBase, setTarjetasBase] = useState<TarjetaBase[]>([]);

  // Todas las compras de todas las tarjetas.
  const [transacciones, setTransacciones] = useState<TransaccionItem[]>([]);

  // Suscripciones tal como las guardó el usuario.
  const [suscripcionesBase, setSuscripcionesBase] = useState<SuscripcionBase[]>([]);

  /* ---------- DATOS CALCULADOS ----------
     Se recalculan en cada render a partir del estado de arriba.
     Por eso, al registrar una compra o pagar un mes, las pantallas
     se actualizan solas sin tener que guardar estos valores. */

  const mesActual = claveMes();

  const tarjetas: TarjetaItem[] = tarjetasBase.map((t) => {
    // ¿Ya se registró el pago del mes en esta tarjeta?
    const pagadaEsteMes = t.ultimoMesPagado === mesActual;

    // Compras que pertenecen a esta tarjeta
    const txDeEstaTarjeta = transacciones.filter((tx) => tx.tarjetaId === t.id);

    // Compras que ya se cobran este mes. Las hechas después del corte tienen
    // mesInicio = mes siguiente: no suman al total de este mes, pero sí ocupan cupo.
    // (las claves "2026-09" / "2026-10" se pueden comparar como texto)
    const txDelMes = txDeEstaTarjeta.filter((tx) => tx.mesInicio <= mesActual);

    // Lo que se paga ESTE mes por compras: la cuota que toca de cada una.
    // La última cuota puede valer distinto (absorbe el redondeo).
    const montoMes = txDelMes.reduce((acc, tx) => acc + montoDeCuota(tx, tx.cuotaActual), 0);

    // Saldo pendiente: lo que todavía falta pagar (incluye la cuota actual y las compras
    // que parten el mes siguiente). Es exacto: el total menos las cuotas ya pagadas.
    // Esto es lo que "ocupa" el cupo de la tarjeta.
    const saldoPendiente = txDeEstaTarjeta.reduce((acc, tx) => acc + saldoPendienteTx(tx), 0);

    // Suscripciones de esta tarjeta que aún NO se pagan este mes.
    // Suman al total del mes y ocupan cupo; al pagar el mes salen, y reaparecen el mes siguiente.
    const montoSuscripciones = suscripcionesBase
      .filter((s) => s.tarjetaId === t.id && s.ultimoMesPagado !== mesActual)
      .reduce((acc, s) => acc + s.monto, 0);

    // Total a pagar este mes = cuotas + suscripciones pendientes
    const montoTotalMes = montoMes + montoSuscripciones;

    // Textos de vencimiento según el día de hoy.
    // Solo dirá "Atrasada" si de verdad hay algo por pagar (no si ya se pagó el mes).
    const { texto, subtexto } = calcularEstadoVencimiento(t.diaVencimiento, {
      pagada: pagadaEsteMes,
      hayPagos: montoTotalMes > 0,
    });

    return {
      ...t, // Copia los datos guardados (id, banco, alias, cupoTotal, etc.)
      pagadaEsteMes,
      montoNumerico: montoTotalMes,
      monto: formatearCLP(montoTotalMes), // Formato chileno: $10.000
      vencimiento: `${texto} (${subtexto})`,
      estadoVencimiento: subtexto,
      // Cupo disponible = cupo total - saldo pendiente - suscripciones (nunca menor a 0)
      cupoDisponible: Math.max(t.cupoTotal - saldoPendiente - montoSuscripciones, 0),
    };
  });

  // Total a pagar este mes sumando todas las tarjetas (para el Home)
  const totalConsolidado = tarjetas.reduce((acc, t) => acc + t.montoNumerico, 0);

  // Suscripciones con próximo cobro calculado, las que cobran antes van primero
  const suscripciones: SuscripcionItem[] = suscripcionesBase
    .map((s) => {
      const t = tarjetas.find((x) => x.id === s.tarjetaId);
      // Se cobra el mismo día en que vence la tarjeta asociada
      const diaCobro = t?.diaVencimiento ?? 1;
      const pagadaEsteMes = s.ultimoMesPagado === mesActual;
      // Si ya se pagó este mes, el próximo cobro es el del mes siguiente
      const c = calcularProximoCobro(diaCobro, pagadaEsteMes);
      return {
        ...s,
        diaCobro,
        pagadaEsteMes,
        tarjetaBanco: t?.banco ?? 'Tarjeta no disponible',
        tarjetaColor: t?.colorHex ?? '#94A3B8',
        proximoCobro: c.texto,
        diasRestantes: c.dias,
        textoRestante: c.subtexto,
      };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  const totalSuscripciones = suscripciones.reduce((acc, s) => acc + s.monto, 0);

  /* ---------- ACCIONES ---------- */

  /**
   * Agrega una tarjeta nueva al inicio de la lista.
   * Se usa desde RegistrarTarjeta.tsx.
   */
  const agregarTarjeta = (nueva: TarjetaBase) => {
    // `prev` es la lista actual; ponemos la nueva primero y luego las anteriores
    setTarjetasBase((prev) => [nueva, ...prev]);
  };

  /**
   * Registra una compra en una tarjeta.
   * Devuelve false (y no guarda nada) si la tarjeta no existe
   * o si el monto supera el cupo disponible.
   * Se usa desde RegistrarTransaccion.tsx.
   */
  const registrarTransaccion = (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ): boolean => {
    // Buscamos la tarjeta para revisar su cupo
    const tarjeta = tarjetas.find((t) => t.id === tarjetaId);

    // Validación del cupo: protege el límite aunque otra pantalla llame esta función
    if (!tarjeta || monto > tarjeta.cupoDisponible) {
      return false;
    }

    // Si las cuotas vienen en 0 o vacías, se toma 1 (pago único)
    const totalCuotasValidas = cuotas > 0 ? cuotas : 1;

    // Valor de las cuotas sin decimales: se redondea hacia abajo y la ÚLTIMA cuota
    // absorbe la diferencia, así las cuotas siempre suman exactamente el monto
    const cuotaMensual = calcularCuotaBase(monto, totalCuotasValidas);

    // ¿Desde qué mes se cobra? Si la compra se hace después del día de corte de la tarjeta
    // (o si el mes ya está pagado), la cuota 1 entra en el estado de cuenta del mes siguiente
    const mesInicio = pasoElCorte(tarjeta.diaVencimiento) || tarjeta.pagadaEsteMes
      ? claveMesSiguiente()
      : mesActual;

    const nuevaTx: TransaccionItem = {
      id: generarId(),
      tarjetaId,
      motivo,
      montoTotal: monto,
      cuotaMensual,
      cuotaActual: 1, // Toda compra parte en la cuota 1
      totalCuotas: totalCuotasValidas,
      mesInicio,
    };

    // La compra nueva va primero en la lista
    setTransacciones((prev) => [nuevaTx, ...prev]);
    return true;
  };

  /**
   * Registra una suscripción asociada a una tarjeta.
   * Reglas: la tarjeta debe existir y el cobro mensual debe caber en su cupo disponible.
   * Igual que las compras: si se registra después del corte (o con el mes ya pagado),
   * el primer cobro es el mes siguiente.
   * Se usa desde RegistrarSuscripcion.tsx.
   */
  const agregarSuscripcion = (nueva: SuscripcionBase): ResultadoSuscripcion => {
    const tarjeta = tarjetas.find((t) => t.id === nueva.tarjetaId);
    if (!tarjeta) return 'sin_tarjeta';
    if (nueva.monto > tarjeta.cupoDisponible) return 'sin_cupo';

    // Marcarla como "al día" este mes hace que parta a cobrarse el mes siguiente
    const empiezaElMesSiguiente = pasoElCorte(tarjeta.diaVencimiento) || tarjeta.pagadaEsteMes;
    const suscripcion = empiezaElMesSiguiente ? { ...nueva, ultimoMesPagado: mesActual } : nueva;

    setSuscripcionesBase((prev) => [suscripcion, ...prev]);
    return 'ok';
  };

  /** Elimina una suscripción (deja de contar en el total y libera su cupo). */
  const eliminarSuscripcion = (id: string) => {
    setSuscripcionesBase((prev) => prev.filter((s) => s.id !== id));
  };

  /**
   * Registra el pago del mes en una tarjeta:
   * - Cada compra que ya se cobra este mes avanza una cuota (las que parten el mes
   *   siguiente no se tocan).
   * - Las compras que ya completaron todas sus cuotas se eliminan.
   * - Las suscripciones de la tarjeta quedan pagadas este mes (vuelven el mes siguiente).
   * - La tarjeta queda marcada como pagada este mes: no se puede pagar dos veces.
   * Al bajar el saldo pendiente, el cupo disponible se libera solo.
   * Devuelve false (sin cambiar nada) si la tarjeta no existe o el mes ya estaba pagado.
   * Se usa desde el detalle de la tarjeta ([id].tsx).
   */
  const pagarMesTarjeta = (tarjetaId: string): boolean => {
    const tarjeta = tarjetas.find((t) => t.id === tarjetaId);
    if (!tarjeta || tarjeta.pagadaEsteMes) return false;

    const mes = claveMes();

    // Tarjeta: se anota el mes pagado (esto bloquea un segundo pago el mismo mes)
    setTarjetasBase((prev) =>
      prev.map((t) => (t.id === tarjetaId ? { ...t, ultimoMesPagado: mes } : t))
    );

    // Suscripciones: se anota el mes pagado; al cambiar de mes vuelven a quedar pendientes
    setSuscripcionesBase((prev) =>
      prev.map((s) => (s.tarjetaId === tarjetaId ? { ...s, ultimoMesPagado: mes } : s))
    );

    // Compras: avanzan una cuota
    setTransacciones((prev) =>
      prev
        .map((tx) => {
          // Solo avanzamos las compras de esta tarjeta que ya se cobran este mes
          if (tx.tarjetaId === tarjetaId && tx.mesInicio <= mes) {
            return { ...tx, cuotaActual: tx.cuotaActual + 1 };
          }
          return tx; // Las de otras tarjetas (o que parten después) quedan igual
        })
        // Si cuotaActual pasó del total, la compra ya está pagada: se retira
        .filter((tx) => tx.cuotaActual <= tx.totalCuotas)
    );

    return true;
  };

  /* ---------- VALOR QUE SE ENTREGA A TODA LA APP ---------- */

  return (
    <AppContext.Provider
      value={{
        tarjetas,
        transacciones,
        suscripciones,
        totalConsolidado,
        totalSuscripciones,
        agregarTarjeta,
        registrarTransaccion,
        agregarSuscripcion,
        eliminarSuscripcion,
        pagarMesTarjeta,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* ============================================================
   HOOK PERSONALIZADO
   ============================================================ */

/**
 * Atajo para leer el contexto desde cualquier pantalla o componente:
 *   const { tarjetas, registrarTransaccion } = useApp();
 * Lanza un error si se usa fuera de <AppProvider> (configurado en _layout.tsx).
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}
