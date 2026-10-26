<<<<<<< HEAD
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeCardsCarousel from '../components/CarruselTarjetas';
import HomeSuscripciones from '../components/HomeSuscripciones';
import HomeCard from '../components/HomeTarjeta';
=======
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
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import BottomNavigation from '../components/MenuNavegacion';

export default function Index() {
  // insets.top es el alto del notch / barra de estado
  const insets = useSafeAreaInsets();
<<<<<<< HEAD

  return (
=======
  // router sirve para cambiar de pantalla con push o replace
  const router = useRouter();

  return (
    // contenedor de toda la pantalla, el paddingTop baja el contenido para que no quede bajo el notch
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
    <View
      className="flex-1 bg-bg-color"
      style={{ paddingTop: insets.top }}
    >
<<<<<<< HEAD
=======
      {/* todo lo de aca adentro se puede deslizar, sin mostrar la barrita de scroll */}
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
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

<<<<<<< HEAD
        {/* Carrusel de Mis Tarjetas */}
        <HomeCardsCarousel />
=======
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
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961

        {/* Suscripciones */}
        <HomeSuscripciones />
      </ScrollView>

<<<<<<< HEAD
      {/* Navegación inferior fija (el botón "+" registra transacciones, suscripciones y tarjetas) */}
=======
      {/* el menu va fuera del ScrollView para que se quede fijo abajo */}
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
      <BottomNavigation />
    </View>
  );
}
