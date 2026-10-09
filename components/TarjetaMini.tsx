import React from 'react';
import { Text, View } from 'react-native';
// el tipo de la tarjeta que recibe este componente
import { TarjetaItem } from '../context/AppContext';

// pasa un numero a pesos chilenos con puntos de miles, ej: 300000 queda "$ 300.000"
const formatearCLP = (n: number) => `$ ${n.toLocaleString('es-CL')}`;

// recibe una tarjeta en item y la dibuja en chico para la lista
export default function TarjetaMini({ item }: { item: TarjetaItem }) {
  // cuanto cupo se ha usado: total menos disponible, nunca menos de 0
  const utilizado = Math.max(item.cupoTotal - item.cupoDisponible, 0);
  // el porcentaje usado, con tope en 100. Si el cupo es 0 devuelve 0 para no dividir por cero
  const porcentaje =
    item.cupoTotal > 0 ? Math.min((utilizado / item.cupoTotal) * 100, 100) : 0;

  return (
    // fila con la tarjeta a la izquierda y los numeros a la derecha
    <View className="flex-row items-center mb-5">
      {/* tarjeta chica, ocupa el 42% del ancho y toma el color del banco (o gris oscuro si no tiene) */}
      <View
        className="w-[42%] h-[104px] p-3 rounded-xl justify-between overflow-hidden shadow-sm"
        style={{ backgroundColor: item.colorHex || '#1E293B' }}>
        {/* circulo blanco transparente en la esquina, es solo adorno */}
        <View className="w-16 h-16 -left-5 -top-5 absolute bg-white/10 rounded-full" />
        {/* dia de vencimiento */}
        <Text className="text-white/80 text-[10px] font-inter-medium">
          Día {item.diaVencimiento}
        </Text>
        {/* nombre del banco, maximo 2 lineas */}
        <Text className="text-white text-sm font-inter-bold" numberOfLines={2}>
          {item.banco}
        </Text>
      </View>


      {/* columna de la derecha con disponible y utilizado */}
      <View className="flex-1 flex-row justify-between pl-4">
        <View>
          <Text className="text-slate-400 text-[11px] font-inter-medium tracking-wide">
            DISPONIBLE
          </Text>
          {/* cupo que queda, en formato de pesos */}
          <Text className="text-slate-900 text-base font-inter-bold mt-1">
            {formatearCLP(item.cupoDisponible)}
          </Text>
        </View>

        {/* items-end alinea esta columna a la derecha */}
        <View className="items-end">
          <Text className="text-slate-400 text-[11px] font-inter-medium tracking-wide">
            UTILIZADO
          </Text>
          {/* porcentaje con un decimal, ej: 24.0% */}
          <Text className="text-slate-900 text-base font-inter-bold mt-1">
            {porcentaje.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
