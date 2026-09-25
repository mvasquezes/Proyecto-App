import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "../context/AppContext";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="Tarjetas" />
  <Stack.Screen name="RegistrarTarjeta" />
  <Stack.Screen name="RegistrarTransaccion" />
  {/* Agrega esta línea si tienes las pantallas registradas una por una */}
  <Stack.Screen name="detalle-tarjeta/[id]" />
</Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}