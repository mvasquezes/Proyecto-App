import React from 'react';
import { Text, View } from 'react-native';
import { TarjetaItem } from '../context/AppContext';

const formatearCLP = (n: number) => `$ ${n.toLocaleString('es-CL')}`;

export default function TarjetaMini({ item }: { item: TarjetaItem }) {
  const utilizado = Math.max(item.cupoTotal - item.cupoDisponible, 0);
  const porcentaje =
    item.cupoTotal > 0 ? Math.min((utilizado / item.cupoTotal) * 100, 100) : 0;

  return (
    <View className="flex-row items-center mb-5">
      {/* Tarjeta pequeña */}
      <View
        className="w-[42%] h-[104px] p-3 rounded-xl justify-between overflow-hidden shadow-sm"
        style={{ backgroundColor: item.colorHex || '#1E293B' }}>
        <View className="w-16 h-16 -left-5 -top-5 absolute bg-white/10 rounded-full" />
        <Text className="text-white/80 text-[10px] font-inter-medium">
          Día {item.diaVencimiento}
        </Text>
        <Text className="text-white text-sm font-inter-bold" numberOfLines={2}>
          {item.banco}
        </Text>
      </View>


      {/* Datos a la derecha */}
      <View className="flex-1 flex-row justify-between pl-4">
        <View>
          <Text className="text-slate-400 text-[11px] font-inter-medium tracking-wide">
            DISPONIBLE
          </Text>
          <Text className="text-slate-900 text-base font-inter-bold mt-1">
            {formatearCLP(item.cupoDisponible)}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-slate-400 text-[11px] font-inter-medium tracking-wide">
            UTILIZADO
          </Text>
          <Text className="text-slate-900 text-base font-inter-bold mt-1">
            {porcentaje.toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );
}