import React, { createContext, ReactNode, useContext, useState } from 'react';

/* ============================================================
   TIPOS (definen la "forma" de los datos de la app)
   ============================================================ */

/**
 * Una compra / cargo registrado en una tarjeta.
 * Se guarda tal cual en el estado `transacciones`.
 */
export interface TransaccionItem {
  id: string;            // Identificador único (usamos la fecha en ms)
  tarjetaId: string;     // A qué tarjeta pertenece (coincide con TarjetaItem.id)
  motivo: string;        // Descripción de la compra (ej: "Ropa Ripley")
  montoTotal: number;    // Monto completo de la compra
  cuotaMensual: number;  // Lo que se paga cada mes (montoTotal / totalCuotas)
  cuotaActual: number;   // Cuota que se está pagando ahora (empieza en 1)
  totalCuotas: number;   // Cantidad total de cuotas
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
  montoNumerico: number;      // Total a pagar este mes (número, para sumar)
  monto: string;              // Mismo total pero formateado: "$10.000"
  estadoVencimiento: string;  // Solo el subtexto: "Quedan 3 días" / "Atrasada..."
  cupoTotal: number;          // Cupo asignado al crear la tarjeta
  cupoDisponible: number;     // Cupo que aún se puede usar (calculado)
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
}

/**
 * Todo lo que el contexto expone a las pantallas.
 * Se accede con: const { tarjetas, agregarTarjeta } = useApp();
 */
interface AppContextType {
  tarjetas: TarjetaItem[];              // Lista de tarjetas con datos calculados
  transacciones: TransaccionItem[];     // Lista de todas las compras
  agregarTarjeta: (tarjeta: TarjetaBase) => void;
  // Devuelve true si se registró, false si se rechazó (ej: supera el cupo)
  registrarTransaccion: (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ) => boolean;
  pagarMesTarjeta: (tarjetaId: string) => void;
  totalConsolidado: number;             // Suma a pagar este mes entre todas las tarjetas
}

// El contexto parte como `undefined`; useApp() valida que exista un Provider.
const AppContext = createContext<AppContextType | undefined>(undefined);

/* ============================================================
   FUNCIONES AUXILIARES
   ============================================================ */

/**
 * Calcula el texto de vencimiento según el día de hoy.
 * Ejemplo: hoy es 10 y vence el 15 -> "Vence 15 de Octubre" + "Quedan 5 días".
 * Devuelve dos textos: `texto` (fecha) y `subtexto` (estado).
 */
function calcularEstadoVencimiento(diaVencimiento: number): { texto: string; subtexto: string } {
  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const nombreMes = meses[hoy.getMonth()]; // getMonth() devuelve 0-11

  const textoFecha = `${diaVencimiento} de ${nombreMes}`;

  if (diaHoy < diaVencimiento) {
    // Aún no vence: contamos los días que faltan
    const diff = diaVencimiento - diaHoy;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Quedan ${diff} día${diff > 1 ? 's' : ''}`,
    };
  } else if (diaHoy === diaVencimiento) {
    // Vence justo hoy
    return {
      texto: `Vence hoy (${textoFecha})`,
      subtexto: '¡Paga hoy!',
    };
  } else {
    // Ya pasó la fecha: contamos los días de atraso
    const diff = diaHoy - diaVencimiento;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Atrasada por ${diff} día${diff > 1 ? 's' : ''}`,
    };
  }
}

/* ============================================================
   PROVIDER (guarda el estado global y las funciones)
   ============================================================ */

export function AppProvider({ children }: { children: ReactNode }) {
  /* ---------- ESTADO ---------- */

  // Tarjetas tal como las guardó el usuario (sin datos calculados).
  const [tarjetasBase, setTarjetasBase] = useState<TarjetaBase[]>([]);

  // Todas las compras de todas las tarjetas.
  const [transacciones, setTransacciones] = useState<TransaccionItem[]>([]);

  /* ---------- DATOS CALCULADOS ----------
     Se recalculan en cada render a partir de tarjetasBase y transacciones.
     Por eso, al registrar una compra o pagar un mes, las pantallas
     se actualizan solas sin tener que guardar estos valores. */

  const tarjetas: TarjetaItem[] = tarjetasBase.map((t) => {
    // Compras que pertenecen a esta tarjeta
    const txDeEstaTarjeta = transacciones.filter((tx) => tx.tarjetaId === t.id);

    // Lo que se paga ESTE mes: suma de la cuota mensual de cada compra
    const montoMes = txDeEstaTarjeta.reduce((acc, curr) => acc + curr.cuotaMensual, 0);

    // Saldo pendiente: lo que todavía falta pagar (incluye la cuota actual).
    // Ej: cuota de $100.000, 6 cuotas, va en la 2 -> quedan 5 -> $500.000.
    // Esto es lo que "ocupa" el cupo de la tarjeta.
    const saldoPendiente = txDeEstaTarjeta.reduce(
      (acc, curr) => acc + curr.cuotaMensual * (curr.totalCuotas - curr.cuotaActual + 1),
      0
    );

    // Textos de vencimiento según el día de hoy
    const { texto, subtexto } = calcularEstadoVencimiento(t.diaVencimiento);

    return {
      ...t, // Copia los datos guardados (id, banco, alias, cupoTotal, etc.)
      montoNumerico: montoMes,
      monto: `$${montoMes.toLocaleString('es-CL')}`, // Formato chileno: $10.000
      vencimiento: `${texto} (${subtexto})`,
      estadoVencimiento: subtexto,
      // Cupo disponible = cupo total - saldo pendiente (nunca menor a 0)
      cupoDisponible: Math.max(t.cupoTotal - saldoPendiente, 0),
    };
  });

  // Total a pagar este mes sumando todas las tarjetas (para el Home)
  const totalConsolidado = tarjetas.reduce((acc, t) => acc + t.montoNumerico, 0);

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

    // Cuota mensual redondeada para evitar decimales
    const cuotaMensual = Math.round(monto / totalCuotasValidas);

    const nuevaTx: TransaccionItem = {
      id: Date.now().toString(), // ID único basado en la hora actual
      tarjetaId,
      motivo,
      montoTotal: monto,
      cuotaMensual,
      cuotaActual: 1, // Toda compra parte en la cuota 1
      totalCuotas: totalCuotasValidas,
    };

    // La compra nueva va primero en la lista
    setTransacciones((prev) => [nuevaTx, ...prev]);
    return true;
  };

  /**
   * Marca el mes como pagado en una tarjeta:
   * - Cada compra de esa tarjeta avanza una cuota.
   * - Las compras que ya completaron todas sus cuotas se eliminan.
   * Al bajar el saldo pendiente, el cupo disponible se libera solo.
   * Se usa desde el detalle de la tarjeta ([id].tsx).
   */
  const pagarMesTarjeta = (tarjetaId: string) => {
    setTransacciones((prev) =>
      prev
        .map((tx) => {
          // Solo avanzamos las compras de la tarjeta indicada
          if (tx.tarjetaId === tarjetaId) {
            return { ...tx, cuotaActual: tx.cuotaActual + 1 };
          }
          return tx; // Las de otras tarjetas quedan igual
        })
        // Si cuotaActual pasó del total, la compra ya está pagada: se retira
        .filter((tx) => tx.cuotaActual <= tx.totalCuotas)
    );
  };

  /* ---------- VALOR QUE SE ENTREGA A TODA LA APP ---------- */

  return (
    <AppContext.Provider
      value={{
        tarjetas,
        transacciones,
        agregarTarjeta,
        registrarTransaccion,
        pagarMesTarjeta,
        totalConsolidado,
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
