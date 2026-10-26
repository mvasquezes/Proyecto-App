import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../context/AppContext';
import '../global.css';

export default function RootLayout() {
  // 1. Cargamos las fuentes en memoria
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  // 2. Ocultamos el Splash Screen cuando las fuentes terminen de cargar
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // 3. Si aún no cargan las fuentes, no renderizamos nada para evitar errores
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* AppProvider: estado global (tarjetas, transacciones, suscripciones) disponible en todas las pantallas */}
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Tarjetas" />
          <Stack.Screen name="RegistrarTarjeta" />
          <Stack.Screen name="RegistrarTransaccion" />
          <Stack.Screen name="Suscripciones" />
          <Stack.Screen name="RegistrarSuscripcion" />
          <Stack.Screen name="detalle-tarjeta/[id]" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
