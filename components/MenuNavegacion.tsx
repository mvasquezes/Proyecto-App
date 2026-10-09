// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// usePathname da la ruta actual, useRouter sirve para navegar
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// para saber cuanto mide la barra de gestos del celular
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavigation() {
  const router = useRouter();
  // ruta en la que estamos, ej: "/" o "/Tarjetas"
  // ojo: no se esta usando todavia (el lint lo avisa), la idea seria usarla para pintar de blanco el boton de la pantalla en que estas
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    // barra oscura con las puntas de arriba redondeadas y los 5 botones en fila
    // el paddingBottom usa lo que mide la barra de gestos, o 12 si es menos
    <View
      className="w-full bg-color-menu rounded-t-3xl flex-row justify-around items-center px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {/* boton Inicio, siempre se ve blanco (activo) aunque estes en otra pantalla */}
      <TouchableOpacity onPress={() => router.replace('/')} className="items-center justify-center flex-1 py-1">
        <Ionicons name="home" size={22} color="#FFFFFF" />
        <Text className="text-white text-[10px] font-inter-regular mt-1">
          Inicio
        </Text>
      </TouchableOpacity>

      {/* boton Suscripciones, en gris y sin onPress porque esa pantalla no existe todavia */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="repeat-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
        Suscripciones
        </Text>
      </TouchableOpacity>

      {/* caja del boton del medio */}
      <View className="items-center justify-center flex-1">
        {/* boton verde redondo con el +, abre el formulario de tarjeta nueva */}
        {/* el -mt-8 lo sube para que sobresalga por encima de la barra */}
        <TouchableOpacity
        onPress={() => router.push('/RegistrarTarjeta')}
        className="w-14 h-14 -mt-8 bg-color-action rounded-full items-center justify-center border-4 border-bg-color shadow-lg"
        activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* boton Tarjetas, abre la lista de tarjetas */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1" onPress={() => router.push('/Tarjetas')}>
        <Ionicons name="card-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
          Tarjetas
        </Text>
      </TouchableOpacity>

      {/* boton Proyecciones, igual que Suscripciones: todavia sin pantalla */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="trending-up-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
          Proyecciones
        </Text>
      </TouchableOpacity>
    </View>
  );
}
