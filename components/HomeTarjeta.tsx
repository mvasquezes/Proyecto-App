import React from 'react';
import { Text, View } from 'react-native';
import { formatearCLP } from '../constants/formato';
import { useApp } from '../context/AppContext';

export default function HomeCard() {
  const { totalConsolidado } = useApp();

  return (
    <View className="w-full px-6 pb-6">
      <View className="w-full p-6 relative bg-color-menu rounded-3xl overflow-hidden shadow-lg">
        {/* Círculo decorativo Figma */}
        <View className="w-40 h-40 -right-10 -top-10 absolute bg-white/5 rounded-full" />

        {/* Sección de textos */}
        <View className="gap-1 z-10">
          <Text className="text-color-inactive text-sm font-normal tracking-tight">
            Gasto consolidado del mes
          </Text>
          <Text className="text-white text-4xl font-bold tracking-tight">
            {formatearCLP(totalConsolidado)}
          </Text>
        </View>

        {/* Píldora inferior */}
        <View className="self-start px-4 py-1.5 bg-color-card-sub rounded-full border border-white/10 z-10 mt-3">
          <Text className="text-slate-300 text-xs font-medium">
            Presupuesto al día
          </Text>
        </View>
      </View>
    </View>
  );
}
