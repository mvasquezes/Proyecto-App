import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface TransaccionItem {
  id: string;
  tarjetaId: string;
  motivo: string;
  montoTotal: number;
  cuotaMensual: number;
  cuotaActual: number;
  totalCuotas: number;
}

export interface TarjetaItem {
  id: string;
  nombre: string;
  banco: string;
  diaVencimiento: number;
  vencimiento: string;
  colorHex: string;
  montoNumerico: number;
  monto: string;
  estadoVencimiento: string;
}

interface AppContextType {
  tarjetas: TarjetaItem[];
  transacciones: TransaccionItem[];
  agregarTarjeta: (tarjeta: {
    id: string;
    nombre: string;
    banco: string;
    diaVencimiento: number;
    colorHex: string;
  }) => void;
  registrarTransaccion: (tarjetaId: string, motivo: string, monto: number, cuotas: number) => void;
  pagarMesTarjeta: (tarjetaId: string) => void;
  totalConsolidado: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Función auxiliar para calcular el texto del vencimiento relativo
function calcularEstadoVencimiento(diaVencimiento: number): { texto: string; subtexto: string } {
  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const nombreMes = meses[hoy.getMonth()];

  const textoFecha = `${diaVencimiento} de ${nombreMes}`;

  if (diaHoy < diaVencimiento) {
    const diff = diaVencimiento - diaHoy;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Quedan ${diff} día${diff > 1 ? 's' : ''}`,
    };
  } else if (diaHoy === diaVencimiento) {
    return {
      texto: `Vence hoy (${textoFecha})`,
      subtexto: '¡Paga hoy!',
    };
  } else {
    const diff = diaHoy - diaVencimiento;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Atrasada por ${diff} día${diff > 1 ? 's' : ''}`,
    };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [tarjetasBase, setTarjetasBase] = useState<
    Array<{
      id: string;
      nombre: string;
      banco: string;
      diaVencimiento: number;
      colorHex: string;
    }>
  >([]);

  const [transacciones, setTransacciones] = useState<TransaccionItem[]>([]);

  const agregarTarjeta = (nueva: {
    id: string;
    nombre: string;
    banco: string;
    diaVencimiento: number;
    colorHex: string;
  }) => {
    setTarjetasBase((prev) => [nueva, ...prev]);
  };

  const registrarTransaccion = (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ) => {
    const totalCuotasValidas = cuotas > 0 ? cuotas : 1;
    const cuotaMensual = Math.round(monto / totalCuotasValidas);

    const nuevaTx: TransaccionItem = {
      id: Date.now().toString(),
      tarjetaId,
      motivo,
      montoTotal: monto,
      cuotaMensual,
      cuotaActual: 1,
      totalCuotas: totalCuotasValidas,
    };

    setTransacciones((prev) => [nuevaTx, ...prev]);
  };

  // Avanza de cuota o elimina la transacción si finalizó
  const pagarMesTarjeta = (tarjetaId: string) => {
    setTransacciones((prev) =>
      prev
        .map((tx) => {
          if (tx.tarjetaId === tarjetaId) {
            return { ...tx, cuotaActual: tx.cuotaActual + 1 };
          }
          return tx;
        })
        .filter((tx) => tx.cuotaActual <= tx.totalCuotas) // Se retiran las finalizadas
    );
  };

  // Cálculo reactivo de totales mensuales por tarjeta
  const tarjetas: TarjetaItem[] = tarjetasBase.map((t) => {
    const txDeEstaTarjeta = transacciones.filter((tx) => tx.tarjetaId === t.id);
    const montoMes = txDeEstaTarjeta.reduce((acc, curr) => acc + curr.cuotaMensual, 0);
    const { texto, subtexto } = calcularEstadoVencimiento(t.diaVencimiento);

    return {
      ...t,
      montoNumerico: montoMes,
      monto: `$${montoMes.toLocaleString('es-CL')}`,
      vencimiento: `${texto} (${subtexto})`,
      estadoVencimiento: subtexto,
    };
  });

  // Consolidado mensual total para el Home
  const totalConsolidado = tarjetas.reduce((acc, t) => acc + t.montoNumerico, 0);

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

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}