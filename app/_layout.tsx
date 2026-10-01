import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "../context/AppContext";
import "../global.css";


//Importar Fuentes
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


export default function RootLayout() {
  // 2. Cargamos las fuentes en memoria
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });


  // 3. Ocultamos el Splash Screen cuando las fuentes terminen de cargar
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Si aún no cargan las fuentes, no renderizamos nada para evitar errores
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Si aún no cargan las fuentes, no renderizamos nada para evitar errores
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Tarjetas" />
          <Stack.Screen name="RegistrarTarjeta" />
          <Stack.Screen name="RegistrarTransaccion" />
          <Stack.Screen name="detalle-tarjeta/[id]" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}