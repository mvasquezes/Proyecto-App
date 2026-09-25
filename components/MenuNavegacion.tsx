import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="w-full bg-color-menu rounded-t-3xl flex-row justify-around items-center px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {/* 1. Inicio (Activo: blanco) */}
      <TouchableOpacity onPress={() => router.replace('/')} className="items-center justify-center flex-1 py-1">
        <Ionicons name="home" size={22} color="#FFFFFF" />
        <Text className="text-white text-[10px] font-medium mt-1">
          Inicio
        </Text>
      </TouchableOpacity>

      {/* 2. Suscripciones (Inactivo) */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="repeat-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-medium mt-1">
        Suscripciones
        </Text>
      </TouchableOpacity>

      {/* 3. Botón Flotante Central (+) */}
      <View className="items-center justify-center flex-1">
        <TouchableOpacity
        onPress={() => router.push('/RegistrarTarjeta')}
        className="w-14 h-14 -mt-8 bg-color-action rounded-full items-center justify-center border-4 border-bg-color shadow-lg"
        activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 4. Tarjetas (Inactivo) */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1" onPress={() => router.push('/Tarjetas')}>
        <Ionicons name="card-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-medium mt-1">
          Tarjetas
        </Text>
      </TouchableOpacity>

      {/* 5. Proyecciones (Inactivo) */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="trending-up-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-medium mt-1">
          Proyecciones
        </Text>
      </TouchableOpacity>
    </View>
  );
}