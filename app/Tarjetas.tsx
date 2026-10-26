import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EncabezadoPantalla from '../components/EncabezadoPantalla';
import BottomNavigation from '../components/MenuNavegacion';
import TarjetaMini from '../components/TarjetaMini';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';

export default function TarjetasScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tarjetas } = useApp();

  return (
    <View className="flex-1 bg-bg-color" style={{ paddingTop: insets.top }}>
      {/* Encabezado con retorno a Inicio */}
      <EncabezadoPantalla titulo="Tarjetas" onVolver={() => router.replace(RUTAS.inicio)} />

      {/* Listado dinámico de tarjetas */}
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        <Text className="text-slate-500 text-sm font-inter-bold tracking-wider mb-5">
          TARJETAS DE CRÉDITO
        </Text>

        {tarjetas.length === 0 ? (
          <View className="p-6 rounded-2xl border border-dashed border-slate-300 items-center justify-center mt-4">
            <Text className="text-slate-400 text-sm font-inter-medium">
              No tienes tarjetas registradas. Pulsa "+" abajo para agregar una.
            </Text>
          </View>
        ) : (
          tarjetas.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              onPress={() => router.push(RUTAS.detalleTarjeta(t.id))}
            >
              <TarjetaMini item={t} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}
