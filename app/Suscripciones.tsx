import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EncabezadoPantalla from '../components/EncabezadoPantalla';
import BottomNavigation from '../components/MenuNavegacion';
import SuscripcionFila from '../components/SuscripcionFila';
import { confirmar } from '../constants/alertas';
import { formatearCLP } from '../constants/formato';
import { RUTAS } from '../constants/rutas';
import { SuscripcionItem, useApp } from '../context/AppContext';

export default function SuscripcionesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { suscripciones, totalSuscripciones, eliminarSuscripcion } = useApp();

  // La suscripción con el cobro más cercano (la lista ya viene ordenada)
  const proxima = suscripciones[0];

  const confirmarEliminar = (s: SuscripcionItem) => {
    confirmar({
      titulo: 'Eliminar suscripción',
      mensaje: `¿Quieres eliminar ${s.nombre}? Dejará de sumarse a tu gasto mensual.`,
      textoConfirmar: 'Eliminar',
      destructivo: true,
      onConfirmar: () => eliminarSuscripcion(s.id),
    });
  };

  return (
    <View className="flex-1 bg-bg-color" style={{ paddingTop: insets.top }}>
      <EncabezadoPantalla titulo="Suscripciones" onVolver={() => router.replace(RUTAS.inicio)} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Resumen: total de todas las suscripciones activas (estén pagadas o no este mes) */}
        <View className="w-full p-6 relative bg-color-menu rounded-3xl overflow-hidden shadow-lg mb-5">
          <View className="w-40 h-40 -right-10 -top-10 absolute bg-white/5 rounded-full" />

          <View className="gap-1 z-10">
            <Text className="text-color-inactive text-sm font-normal tracking-tight">
              Gasto mensual en suscripciones
            </Text>
            <Text className="text-white text-4xl font-bold tracking-tight">
              {formatearCLP(totalSuscripciones)}
            </Text>
          </View>

          <View className="flex-row gap-2 mt-3 z-10">
            <View className="px-4 py-1.5 bg-color-card-sub rounded-full border border-white/10">
              <Text className="text-slate-300 text-xs font-medium">
                {suscripciones.length} activa{suscripciones.length === 1 ? '' : 's'}
              </Text>
            </View>
            <View className="px-4 py-1.5 bg-color-card-sub rounded-full border border-white/10">
              <Text className="text-slate-300 text-xs font-medium">
                {formatearCLP(totalSuscripciones * 12)} al año
              </Text>
            </View>
          </View>
        </View>

        {/* Próximo cobro */}
        {proxima && (
          <View className="flex-row items-center p-4 mb-5 bg-blue-50 border border-blue-100 rounded-2xl">
            <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={18} color="#1D4ED8" />
            </View>
            <Text className="flex-1 text-blue-900 text-xs font-inter-regular">
              Próximo cobro: <Text className="font-inter-bold">{proxima.nombre}</Text>{' '}
              ({proxima.textoRestante.toLowerCase()}) por{' '}
              <Text className="font-inter-bold">{formatearCLP(proxima.monto)}</Text>
            </Text>
          </View>
        )}

        {/* Botón nueva suscripción */}
        <TouchableOpacity
          onPress={() => router.push(RUTAS.registrarSuscripcion)}
          activeOpacity={0.8}
          className="w-full h-14 bg-color-action rounded-2xl flex-row items-center justify-center gap-2 shadow-sm mb-6"
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text className="text-white text-base font-bold tracking-tight">Nueva Suscripción</Text>
        </TouchableOpacity>

        {/* Listado */}
        <Text className="text-slate-500 text-sm font-inter-bold tracking-wider mb-4">
          PRÓXIMOS COBROS
        </Text>

        {suscripciones.length === 0 ? (
          <View className="p-6 rounded-2xl border border-dashed border-slate-300 items-center justify-center">
            <Text className="text-slate-400 text-sm font-inter-medium text-center">
              Aún no tienes suscripciones registradas.
            </Text>
          </View>
        ) : (
          suscripciones.map((s) => (
            <SuscripcionFila key={s.id} item={s} mostrarCobro onEliminar={confirmarEliminar} />
          ))
        )}

        <View className="h-6" />
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}
