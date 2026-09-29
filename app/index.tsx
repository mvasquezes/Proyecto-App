import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavigation from '../components/MenuNavegacion';

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View 
      className="flex-1 bg-bg-color" 
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Saludo */}
        <View className="w-full px-6 pt-8 pb-4 flex-row justify-between items-center">
          <Text className="text-color-menu text-xl font-inter-bold">
            Hola, Usuario 👋
          </Text>
        </View>


        {/* Botón de Acción Rápida: Nueva Transacción */}
        <View className="w-full px-6 pb-6">
          <TouchableOpacity
            onPress={() => router.push('/RegistrarTransaccion')}
            activeOpacity={0.8}
            className="w-full h-14 bg-color-action rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
          >
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text className="text-white text-base font-bold tracking-tight">
              Registrar Transacción
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Navegación inferior fija */}
      <BottomNavigation />
    </View>
  );
}