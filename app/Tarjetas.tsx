import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomNavigation from '../components/MenuNavegacion';
import CardItem from '../components/TarjetaGrande';
import { useApp } from '../context/AppContext';

export default function TarjetasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tarjetas } = useApp();

  return (
    <View className="flex-1 bg-bg-color" style={{ paddingTop: insets.top }}>
      {/* Encabezado con retorno a Inicio */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-slate-800 text-lg font-bold">
          Tarjetas
        </Text>
        <View className="w-8" />
      </View>

      {/* Listado dinámico de tarjetas */}
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        {tarjetas.length === 0 ? (
          <View className="p-6 rounded-2xl border border-dashed border-slate-300 items-center justify-center mt-4">
            <Text className="text-slate-400 text-sm font-medium">
              No tienes tarjetas registradas. Pulsa "+" abajo para agregar una.
            </Text>
          </View>
        ) : (
          tarjetas.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              onPress={() => router.push(`../detalle-tarjeta/${t.id}`)}
            >
              <CardItem item={t} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}