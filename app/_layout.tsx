<<<<<<< HEAD
=======
// Stack hace que las pantallas se apilen una encima de otra al navegar
import { Stack } from "expo-router";
// da los margenes seguros del celular (notch arriba y barra de gestos abajo)
import { SafeAreaProvider } from "react-native-safe-area-context";
// el provider que guarda las tarjetas y las compras para toda la app
import { AppProvider } from "../context/AppContext";
// carga los estilos de tailwind, sin esto los className no hacen nada
import "../global.css";


// las 3 variantes de la letra Inter que usamos y el hook para cargarlas
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
<<<<<<< HEAD
import { Stack } from 'expo-router';
=======
// para manejar la pantalla de carga que sale al abrir la app
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import '../global.css';

export default function RootLayout() {
<<<<<<< HEAD
  // 1. Cargamos las fuentes en memoria
=======
  // carga las fuentes: fontsLoaded pasa a true cuando terminan y error trae algo si fallan
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

<<<<<<< HEAD
  // 2. Ocultamos el Splash Screen cuando las fuentes terminen de cargar
=======

  // se vuelve a ejecutar cada vez que cambia fontsLoaded o error
  useEffect(() => {
    // si ya cargaron o si fallaron, escondemos la pantalla de carga
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // ojo: este useEffect hace exactamente lo mismo que el de arriba, esta repetido y se puede borrar
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

<<<<<<< HEAD
  // 3. Si aún no cargan las fuentes, no renderizamos nada para evitar errores
=======
  // si las fuentes todavia no cargan no dibujamos nada, asi el texto no aparece con otra letra y despues salta
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    // envuelve todo para que cualquier pantalla pueda pedir los margenes seguros
    <SafeAreaProvider>
<<<<<<< HEAD
      {/* AppProvider: estado global (tarjetas, transacciones, suscripciones) disponible en todas las pantallas */}
=======
      {/* deja las tarjetas y compras disponibles en todas las pantallas */}
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
      <AppProvider>
        {/* headerShown en false esconde la barra de titulo de expo, cada pantalla dibuja la suya */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* cada Stack.Screen corresponde a un archivo dentro de la carpeta app */}
          <Stack.Screen name="index" />
          <Stack.Screen name="Tarjetas" />
          <Stack.Screen name="RegistrarTarjeta" />
          <Stack.Screen name="RegistrarTransaccion" />
<<<<<<< HEAD
          <Stack.Screen name="Suscripciones" />
          <Stack.Screen name="RegistrarSuscripcion" />
=======
          {/* esta recibe el id de la tarjeta en la ruta, por eso el [id] */}
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
          <Stack.Screen name="detalle-tarjeta/[id]" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
