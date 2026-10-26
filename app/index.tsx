import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeCardsCarousel from '../components/CarruselTarjetas';
import HomeSuscripciones from '../components/HomeSuscripciones';
import HomeCard from '../components/HomeTarjeta';
import BottomNavigation from '../components/MenuNavegacion';

export default function Index() {
  // insets.top es el alto del notch / barra de estado
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-bg-color"
      style={{ paddingTop: insets.top }}
    >
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

        {/* Tarjeta principal home */}
        <HomeCard />

        {/* Carrusel de Mis Tarjetas */}
        <HomeCardsCarousel />

        {/* Suscripciones */}
        <HomeSuscripciones />
      </ScrollView>

      {/* Navegación inferior fija (el botón "+" registra transacciones, suscripciones y tarjetas) */}
      <BottomNavigation />
    </View>
  );
}
