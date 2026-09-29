import React from 'react';
import { Text, View } from 'react-native';
import { TarjetaItem } from '../context/AppContext';

export default function CardItem({ item }: { item: TarjetaItem }) {
  return (
    <View 
      className="w-full h-40 p-6 rounded-3xl justify-between overflow-hidden shadow-lg mb-4"
      style={{ backgroundColor: item.colorHex || '#1E293B' }}
    >
      {/* Brillo circular superior de Figma */}
      <View className="w-28 h-28 -left-8 -top-8 absolute bg-white/10 rounded-full" />

      {/* Nombre del Banco */}
      <View className="flex-row justify-between items-start">
        <Text className="text-white text-base font-inter-bold tracking-wide">
          {item.banco || "Nombre Banco"}
        </Text>
      </View>


      {/* Monto y Vencimiento */}
      <View className="gap-1">
        <Text className="text-white/80 text-xs font-inter-medium">
          Total a Pagar:
        </Text>
        <Text className="text-white text-3xl font-inter-medium tracking-tight">
          {item.monto || "$0"}
        </Text>
        <Text className="text-white/80 text-xs font-inter-regular pt-0.5">
          {item.vencimiento || "Fecha no definida"}
        </Text>
      </View>
    </View>
  );
}