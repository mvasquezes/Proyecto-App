import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CardItem from '../../components/TarjetaGrande';
import { useApp } from '../../context/AppContext';

export default function DetalleTarjetaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tarjetas, transacciones, pagarMesTarjeta } = useApp();
  const tarjeta = tarjetas.find((t) => t.id === id);
  const txTarjeta = transacciones.filter((tx) => tx.tarjetaId === id);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0F172A');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  if (!tarjeta) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-slate-600 text-base mb-4">Tarjeta no encontrada.</Text>
        <TouchableOpacity
          onPress={() => router.replace('/Tarjetas')}
          className="px-5 py-2.5 bg-color-action rounded-xl">
          <Text className="text-white font-inter-bold">Volver a Tarjetas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleMarcarPagado = () => {
    if (txTarjeta.length === 0) {
      if (Platform.OS === 'web') {
        alert('Esta tarjeta no tiene cuotas pendientes este mes.');
      } else {
        Alert.alert('Al día', 'Esta tarjeta no tiene cuotas pendientes este mes.');
      }
      return;
    }

    if (Platform.OS === 'web') {
      const confirma = window.confirm(
        'Confirmar Pago del Mes\n\n¿Deseas marcar este mes como pagado? Las compras avanzarán una cuota y las que finalicen se eliminarán.'
      );
      if (confirma) {
        pagarMesTarjeta(tarjeta.id);
        alert('Cuotas del mes pagadas con éxito.');
      }
    } else {
      Alert.alert(
        'Confirmar Pago del Mes',
        '¿Deseas marcar este mes como pagado? Las compras avanzarán una cuota y las que finalicen se eliminarán.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar Pago',
            onPress: () => {
              pagarMesTarjeta(tarjeta.id);
              Alert.alert('Listo', 'Cuotas del mes pagadas con éxito.');
            },
          },
        ]
      );
    }
  };

  return (
    <View
      className="flex-1 bg-color-menu"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 bg-white">
        {/* Encabezado */}
        <View className="px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100">
          <TouchableOpacity onPress={() => router.back()} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-inter-bold">Detalle Tarjeta</Text>
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Tarjeta superior con datos dinámicos */}
          <CardItem item={tarjeta} />

          {/* Cargos y Compras en Cuotas */}
          <View className="mt-2 mb-6">
            <Text className="text-slate-900 text-base font-inter-bold mb-3">
              Cargos y Compras en Cuotas
            </Text>

            {txTarjeta.length === 0 ? (
              <View className="p-4 rounded-2xl border border-dashed border-slate-200 items-center justify-center">
                <Text className="text-slate-400 text-xs">Sin pagos pendientes para este mes</Text>
              </View>
            ) : (
              txTarjeta.map((tx) => (
                <View
                  key={tx.id}
                  className="p-4 bg-white rounded-2xl border border-slate-100 flex-row justify-between items-center shadow-sm mb-3"
                >
                  <View>
                    <Text className="text-slate-900 text-base font  bold">{tx.motivo}</Text>
                    <Text className="text-slate-400 text-xs font-inter-medium">
                      Cuota {tx.cuotaActual} de {tx.totalCuotas} (Total: ${tx.montoTotal.toLocaleString('es-CL')})
                    </Text>
                  </View>
                  <Text className="text-slate-900 text-base font-inter-bold">
                    ${tx.cuotaMensual.toLocaleString('es-CL')}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Barra inferior fija: Botón Pagar Mes */}
        <View className="w-full px-6 py-3 border-t border-slate-100 bg-white">
          <TouchableOpacity
            onPress={handleMarcarPagado}
            activeOpacity={0.8}
            className="w-full h-12 bg-color-action rounded-2xl items-center justify-center shadow-sm"
          >
            <Text className="text-white text-base font-inter-bold">Pagar Mes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}