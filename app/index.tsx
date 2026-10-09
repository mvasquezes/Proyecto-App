// iconos de la libreria Ionicons
import { Ionicons } from '@expo/vector-icons';
// hook para movernos entre pantallas
import { useRouter } from 'expo-router';
import React from 'react';
// componentes basicos de react native: contenedor con scroll, texto, boton y caja
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// para saber cuanto espacio ocupa el notch y no tapar el contenido
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// el menu de abajo
import BottomNavigation from '../components/MenuNavegacion';

export default function Index() {
  // insets.top es el alto del notch / barra de estado
  const insets = useSafeAreaInsets();
  // router sirve para cambiar de pantalla con push o replace
  const router = useRouter();

  return (
    // contenedor de toda la pantalla, el paddingTop baja el contenido para que no quede bajo el notch
    <View
      className="flex-1 bg-bg-color"
      style={{ paddingTop: insets.top }}
    >
      {/* todo lo de aca adentro se puede deslizar, sin mostrar la barrita de scroll */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* fila del saludo, el nombre esta fijo porque todavia no hay login */}
        <View className="w-full px-6 pt-8 pb-4 flex-row justify-between items-center">
          <Text className="text-color-menu text-xl font-inter-bold">
            Hola, Usuario 👋
          </Text>
        </View>


        {/* caja con margen para el boton verde */}
        <View className="w-full px-6 pb-6">
          {/* boton verde, al tocarlo abre la pantalla para registrar una compra */}
          <TouchableOpacity
            onPress={() => router.push('/RegistrarTransaccion')}
            activeOpacity={0.8}
            className="w-full h-14 bg-color-action rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            {/* icono del + dentro de un circulo */}
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text className="text-white text-base font-bold tracking-tight">
              Registrar Transacción
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* el menu va fuera del ScrollView para que se quede fijo abajo */}
      <BottomNavigation />
    </View>
  );
}
