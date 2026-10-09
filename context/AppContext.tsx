// createContext crea el contexto, useContext lo lee y useState guarda los datos
import React, { createContext, ReactNode, useContext, useState } from 'react';

// una compra hecha con una tarjeta
export interface TransaccionItem {
  id: string;            // id unico, se usa la hora en milisegundos
  tarjetaId: string;     // id de la tarjeta con la que se compro
  motivo: string;        // descripcion de la compra (ej: "Ropa Ripley")
  montoTotal: number;    // lo que costo la compra completa
  cuotaMensual: number;  // lo que se paga cada mes (montoTotal / totalCuotas)
  cuotaActual: number;   // en que cuota va, parte en 1
  totalCuotas: number;   // cuantas cuotas son en total
}

// una tarjeta lista para mostrar: los datos que guardo el usuario mas los que se calculan
// es lo que reciben TarjetaGrande y TarjetaMini
export interface TarjetaItem {
  id: string;
  nombre: string;             // titulo que se ve en la tarjeta
  alias: string;              // nombre interno (obligatorio en Visa y MasterCard)
  banco: string;
  diaVencimiento: number;     // dia del mes en que vence (1 a 31)
  vencimiento: string;        // calculado, ej: "Vence 15 de Octubre (Quedan 3 dias)"
  colorHex: string;           // color de la tarjeta
  montoNumerico: number;      // calculado: total a pagar este mes como numero, para poder sumar
  monto: string;              // calculado: el mismo total pero con formato, ej: "$10.000"
  estadoVencimiento: string;  // calculado: solo la parte de "Quedan 3 dias" o "Atrasada..."
  cupoTotal: number;          // cupo que se puso al crear la tarjeta
  cupoDisponible: number;     // calculado: cupo que queda libre
}

// solo los datos que escribe el usuario, los calculados no se guardan para que nunca queden desactualizados
interface TarjetaBase {
  id: string;
  nombre: string;
  alias: string;
  banco: string;
  diaVencimiento: number;
  colorHex: string;
  cupoTotal: number;
}

// todo lo que el contexto le entrega a las pantallas
interface AppContextType {
  tarjetas: TarjetaItem[];              // tarjetas con sus datos calculados
  transacciones: TransaccionItem[];     // todas las compras de todas las tarjetas
  agregarTarjeta: (tarjeta: TarjetaBase) => void;
  // devuelve true si se guardo y false si se rechazo (por ejemplo si supera el cupo)
  registrarTransaccion: (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ) => boolean;
  pagarMesTarjeta: (tarjetaId: string) => void;
  totalConsolidado: number;             // lo que hay que pagar este mes sumando todas las tarjetas
}

// crea el contexto vacio (undefined), useApp revisa mas abajo que exista el Provider
const AppContext = createContext<AppContextType | undefined>(undefined);

// arma los textos del vencimiento comparando el dia de hoy con el dia que vence la tarjeta
// ojo: solo compara el dia y no el mes, si vence el 31 en un mes de 30 dias igual dice 31,
// y pasado el dia sale "Atrasada" aunque ya se haya pagado el mes
function calcularEstadoVencimiento(diaVencimiento: number): { texto: string; subtexto: string } {
  // fecha de hoy
  const hoy = new Date();
  // numero del dia de hoy (1 a 31)
  const diaHoy = hoy.getDate();
  // nombres de los meses para mostrarlos en texto
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  // getMonth devuelve de 0 a 11, asi que sirve directo como posicion en el arreglo
  const nombreMes = meses[hoy.getMonth()];

  // ej: "15 de Octubre"
  const textoFecha = `${diaVencimiento} de ${nombreMes}`;

  // todavia no llega el dia: cuenta cuantos dias faltan
  if (diaHoy < diaVencimiento) {
    const diff = diaVencimiento - diaHoy;
    return {
      texto: `Vence ${textoFecha}`,
      // agrega la "s" de dias solo si es mas de 1
      subtexto: `Quedan ${diff} día${diff > 1 ? 's' : ''}`,
    };
  // vence justo hoy
  } else if (diaHoy === diaVencimiento) {
    return {
      texto: `Vence hoy (${textoFecha})`,
      subtexto: '¡Paga hoy!',
    };
  // ya paso el dia: cuenta los dias de atraso
  } else {
    const diff = diaHoy - diaVencimiento;
    return {
      texto: `Vence ${textoFecha}`,
      subtexto: `Atrasada por ${diff} día${diff > 1 ? 's' : ''}`,
    };
  }
}

// el provider envuelve la app (en _layout.tsx) y guarda todos los datos
// ojo: todo queda en memoria con useState, si se cierra o recarga la app se pierde
export function AppProvider({ children }: { children: ReactNode }) {
  // las tarjetas tal cual las guardo el usuario, sin los datos calculados
  const [tarjetasBase, setTarjetasBase] = useState<TarjetaBase[]>([]);

  // todas las compras de todas las tarjetas
  const [transacciones, setTransacciones] = useState<TransaccionItem[]>([]);

  // recorre cada tarjeta guardada y le agrega los datos calculados
  // esto se vuelve a hacer en cada render, por eso al pagar o comprar todo se actualiza solo
  const tarjetas: TarjetaItem[] = tarjetasBase.map((t) => {
    // se queda con las compras de esta tarjeta
    const txDeEstaTarjeta = transacciones.filter((tx) => tx.tarjetaId === t.id);

    // lo que se paga este mes: suma la cuota mensual de cada compra
    const montoMes = txDeEstaTarjeta.reduce((acc, curr) => acc + curr.cuotaMensual, 0);

    // lo que falta por pagar contando la cuota actual, es lo que ocupa cupo
    // ej: cuota de $100.000, 6 cuotas, va en la 2 -> quedan 5 -> $500.000
    const saldoPendiente = txDeEstaTarjeta.reduce(
      (acc, curr) => acc + curr.cuotaMensual * (curr.totalCuotas - curr.cuotaActual + 1),
      0
    );

    // saca los textos de vencimiento segun el dia de hoy
    const { texto, subtexto } = calcularEstadoVencimiento(t.diaVencimiento);

    return {
      ...t, // copia los datos guardados (id, banco, alias, cupoTotal, etc.)
      montoNumerico: montoMes,
      monto: `$${montoMes.toLocaleString('es-CL')}`, // pone los puntos de miles, ej: $10.000
      vencimiento: `${texto} (${subtexto})`,
      estadoVencimiento: subtexto,
      // cupo total menos lo pendiente, con Math.max para que nunca baje de 0
      cupoDisponible: Math.max(t.cupoTotal - saldoPendiente, 0),
    };
  });

  // suma lo que hay que pagar este mes en todas las tarjetas
  const totalConsolidado = tarjetas.reduce((acc, t) => acc + t.montoNumerico, 0);

  // agrega una tarjeta nueva (se llama desde RegistrarTarjeta.tsx)
  const agregarTarjeta = (nueva: TarjetaBase) => {
    // prev es la lista actual: pone la nueva primero y despues las que ya estaban
    setTarjetasBase((prev) => [nueva, ...prev]);
  };

  // registra una compra (se llama desde RegistrarTransaccion.tsx)
  const registrarTransaccion = (
    tarjetaId: string,
    motivo: string,
    monto: number,
    cuotas: number
  ): boolean => {
    // busca la tarjeta para revisar cuanto cupo le queda
    const tarjeta = tarjetas.find((t) => t.id === tarjetaId);

    // si la tarjeta no existe o la compra es mas grande que el cupo libre, no guarda nada y devuelve false
    if (!tarjeta || monto > tarjeta.cupoDisponible) {
      return false;
    }

    // si las cuotas vienen en 0 o negativas se toma como 1 (pago en una sola cuota)
    const totalCuotasValidas = cuotas > 0 ? cuotas : 1;

    // divide el monto en las cuotas y redondea para no tener decimales
    // por el redondeo puede quedar un peso de diferencia (ej: 100.000 en 3 cuotas = 33.333 x 3 = 99.999)
    const cuotaMensual = Math.round(monto / totalCuotasValidas);

    // arma la compra nueva
    const nuevaTx: TransaccionItem = {
      id: Date.now().toString(), // la hora actual en milisegundos como id
      tarjetaId,
      motivo,
      montoTotal: monto,
      cuotaMensual,
      cuotaActual: 1, // toda compra parte en la cuota 1
      totalCuotas: totalCuotasValidas,
    };

    // la agrega al principio de la lista de compras
    setTransacciones((prev) => [nuevaTx, ...prev]);
    return true;
  };

  // paga el mes de una tarjeta (se llama desde el detalle, [id].tsx)
  const pagarMesTarjeta = (tarjetaId: string) => {
    setTransacciones((prev) =>
      prev
        .map((tx) => {
          // a las compras de esta tarjeta les suma 1 a la cuota actual
          if (tx.tarjetaId === tarjetaId) {
            return { ...tx, cuotaActual: tx.cuotaActual + 1 };
          }
          return tx; // las de otras tarjetas quedan igual
        })
        // borra las compras que ya pasaron su ultima cuota, asi se libera el cupo
        .filter((tx) => tx.cuotaActual <= tx.totalCuotas)
    );
  };

  // entrega los datos y funciones a todo lo que este dentro del provider
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

// atajo para usar el contexto en cualquier pantalla: const { tarjetas } = useApp();
export function useApp() {
  // lee el contexto
  const context = useContext(AppContext);
  // si se usa fuera del AppProvider tira un error, asi nos damos cuenta altiro
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}
