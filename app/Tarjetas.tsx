// iconos de Ionicons (la flecha para volver)
import { Ionicons } from '@expo/vector-icons';
// para navegar entre pantallas
import { useRouter } from 'expo-router';
import React from 'react';
// componentes basicos de react native
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// para respetar el espacio del notch
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// menu de abajo
import BottomNavigation from '../components/MenuNavegacion';
// tarjeta chica que se muestra en la lista
import TarjetaMini from '../components/TarjetaMini';
// hook para leer los datos globales de la app
import { useApp } from '../context/AppContext';

export default function TarjetasScreen() {
  // margenes seguros del celular
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // sacamos la lista de tarjetas del contexto (ya viene con cupo disponible y monto calculados)
  const { tarjetas } = useApp();

  return (
    // contenedor de la pantalla, bajado lo que mide el notch
    <View className="flex-1 bg-bg-color" style={{ paddingTop: insets.top }}>
      {/* fila del encabezado: flecha, titulo y una caja vacia para que el titulo quede centrado */}
      <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
        {/* replace en vez de back para que no se vayan acumulando pantallas */}
        <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-slate-800 text-lg font-inter-bold">Tarjetas</Text>
        <View className="w-8" />
      </View>

      {/* lista que se puede deslizar */}
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
        <Text className="text-slate-500 text-sm font-inter-bold tracking-wider mb-5">
          TARJETAS DE CRÉDITO
        </Text>

        {/* si no hay tarjetas mostramos un aviso, si hay las recorremos con map */}
        {/* ojo: el lint marca error por las comillas de "+" en el texto del aviso, se arregla escribiendolas como {'"+"'} */}
        {tarjetas.length === 0 ? (
          <View className="p-6 rounded-2xl border border-dashed border-slate-300 items-center justify-center mt-4">
            <Text className="text-slate-400 text-sm font-inter-medium">
              No tienes tarjetas registradas. Pulsa "+" abajo para agregar una.
            </Text>
          </View>
        ) : (
          // por cada tarjeta armamos un boton con su tarjeta chica adentro
          tarjetas.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              // al tocarla abre el detalle pasando el id en la ruta
              onPress={() => router.push(`../detalle-tarjeta/${t.id}`)}
            >
              <TarjetaMini item={t} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* menu fijo abajo */}
      <BottomNavigation />
    </View>
  );
}
