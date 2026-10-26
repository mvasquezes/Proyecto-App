import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLOR_TARJETA_DEFAULT } from '../constants/banks';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';

export default function HomeCardsCarousel() {
  const router = useRouter();
  const { tarjetas } = useApp();

  return (
    <View className="w-full pb-8">
      {/* Encabezado: Título y enlace 'Ver todas' */}
      <View className="px-6 flex-row justify-between items-center mb-4">
        <Text className="text-slate-800 text-base font-bold tracking-tight">
          Mis Tarjetas
        </Text>
        <TouchableOpacity
          onPress={() => router.push(RUTAS.tarjetas)}
          activeOpacity={0.7}
        >
          <Text className="text-slate-500 text-xs font-medium">
            Ver todas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Estado vacío si no hay tarjetas */}
      {tarjetas.length === 0 ? (
        <View className="mx-6 p-4 rounded-2xl border border-dashed border-slate-300 items-center justify-center">
          <Text className="text-slate-400 text-xs font-medium">
            No tienes tarjetas registradas. Pulsa "+" para agregar una.
          </Text>
        </View>
      ) : (
        /* Carrusel horizontal */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        >
          {tarjetas.map((tarjeta) => (
            <TouchableOpacity
              key={tarjeta.id}
              activeOpacity={0.85}
              onPress={() => router.push(RUTAS.detalleTarjeta(tarjeta.id))}
              className="h-24 w-40 p-4 rounded-2xl justify-between overflow-hidden shadow-sm"
              style={{ backgroundColor: tarjeta.colorHex || COLOR_TARJETA_DEFAULT }}
            >
              {/* Círculo decorativo Figma */}
              <View className="w-16 h-16 -left-4 -top-4 absolute bg-white/10 rounded-full" />

              {/* Ícono superior */}
              <View className="flex-row justify-between items-start">
                <Ionicons name="card-outline" size={18} color="#FFFFFF" />
              </View>

              {/* Nombre de la tarjeta o banco */}
              <View>
                <Text
                  numberOfLines={1}
                  className="text-white text-xs font-medium tracking-tight"
                >
                  {tarjeta.nombre || tarjeta.banco}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
