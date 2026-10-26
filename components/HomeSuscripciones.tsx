import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatearCLP } from '../constants/formato';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';
import SuscripcionFila from './SuscripcionFila';

// Cuántas suscripciones se muestran en el Home antes de "Ver todas"
const MAX_HOME = 3;

export default function HomeSuscripciones() {
  const router = useRouter();
  const { suscripciones, totalSuscripciones } = useApp();

  return (
    <View className="w-full px-6 pb-8">
      {/* Encabezado: título + píldora con total mensual */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-slate-800 text-base font-bold tracking-tight">Suscripciones</Text>
        <TouchableOpacity
          onPress={() => router.push(RUTAS.suscripciones)}
          activeOpacity={0.7}
          className="flex-row items-baseline px-3 py-1.5 bg-white rounded-full border border-slate-100"
        >
          <Text className="text-slate-900 text-xs font-inter-bold">
            {formatearCLP(totalSuscripciones)}
          </Text>
          <Text className="text-slate-400 text-[10px] font-inter-regular"> /mes</Text>
        </TouchableOpacity>
      </View>

      {suscripciones.length === 0 ? (
        <TouchableOpacity
          onPress={() => router.push(RUTAS.registrarSuscripcion)}
          activeOpacity={0.7}
          className="p-4 rounded-2xl border border-dashed border-slate-300 items-center justify-center"
        >
          <Text className="text-slate-400 text-xs font-medium">
            No tienes suscripciones. Toca aquí para agregar una.
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          {suscripciones.slice(0, MAX_HOME).map((s) => (
            <SuscripcionFila key={s.id} item={s} />
          ))}
          {suscripciones.length > MAX_HOME && (
            <TouchableOpacity onPress={() => router.push(RUTAS.suscripciones)} activeOpacity={0.7}>
              <Text className="text-slate-500 text-xs font-medium text-center pt-1">
                Ver las {suscripciones.length} suscripciones
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
