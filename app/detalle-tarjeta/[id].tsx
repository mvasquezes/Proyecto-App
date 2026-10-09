// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// para cambiar el color de la barra de navegacion de android (la de los botones de abajo)
import * as NavigationBar from 'expo-navigation-bar';
// useLocalSearchParams lee los parametros de la ruta, en este caso el id
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// la tarjeta grande de arriba
import CardItem from '../../components/TarjetaGrande';
// datos y funciones del contexto
import { useApp } from '../../context/AppContext';

export default function DetalleTarjetaScreen() {
  // saca el id que viene en la ruta, ej: /detalle-tarjeta/1727630000000
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // tarjetas, compras y la funcion para pagar el mes
  const { tarjetas, transacciones, pagarMesTarjeta } = useApp();
  // busca la tarjeta que tiene ese id
  const tarjeta = tarjetas.find((t) => t.id === id);
  // se queda solo con las compras de esta tarjeta
  const txTarjeta = transacciones.filter((tx) => tx.tarjetaId === id);

  // se ejecuta una sola vez al abrir la pantalla (por el [] vacio)
  useEffect(() => {
    // solo en android: pinta la barra de abajo del sistema de azul oscuro con botones claros
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0F172A');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  // si no encontro la tarjeta (por ejemplo se recargo la app y se borro todo) muestra un aviso
  if (!tarjeta) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <Text className="text-slate-600 text-base mb-4">Tarjeta no encontrada.</Text>
        {/* boton para volver a la lista */}
        <TouchableOpacity
          onPress={() => router.replace('/Tarjetas')}
          className="px-5 py-2.5 bg-color-action rounded-xl">
          <Text className="text-white font-inter-bold">Volver a Tarjetas</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // se ejecuta al tocar "Marcar Mes como Pagado"
  // ojo: en web Alert.alert con botones no hace nada, asi que este boton solo funciona en el celular
  const handleMarcarPagado = () => {
    // si la tarjeta no tiene compras avisa que esta al dia y corta
    if (txTarjeta.length === 0) {
      Alert.alert('Al día', 'Esta tarjeta no tiene cuotas pendientes este mes.');
      return;
    }

    // pide confirmacion con dos botones
    Alert.alert(
      'Confirmar Pago del Mes',
      '¿Deseas marcar este mes como pagado? Las compras avanzarán una cuota y las que finalicen se eliminarán.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Pago',
          onPress: () => {
            // avanza una cuota en todas las compras de esta tarjeta y borra las que terminan
            pagarMesTarjeta(tarjeta.id);
            // muestra que salio bien
            Alert.alert('Listo', 'Cuotas del mes pagadas con éxito.');
          },
        },
      ]
    );
  };

  return (
    // fondo oscuro con espacio para el notch y la barra de gestos
    <View
      className="flex-1 bg-color-menu"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* caja blanca con el contenido */}
      <View className="flex-1 bg-white">
        {/* encabezado: flecha, titulo y caja vacia para centrar */}
        <View className="px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100">
          {/* back vuelve a la pantalla anterior (la lista de tarjetas) */}
          <TouchableOpacity onPress={() => router.back()} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-inter-bold">Detalle Tarjeta</Text>
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* tarjeta grande con el total del mes y el vencimiento */}
          <CardItem item={tarjeta} />

          {/* seccion de compras */}
          <View className="mt-2 mb-6">
            <Text className="text-slate-900 text-base font-inter-bold mb-3">
              Cargos y Compras en Cuotas
            </Text>

            {/* si no hay compras muestra un aviso, si hay dibuja una fila por cada una */}
            {txTarjeta.length === 0 ? (
              <View className="p-4 rounded-2xl border border-dashed border-slate-200 items-center justify-center">
                <Text className="text-slate-400 text-xs">Sin pagos pendientes para este mes</Text>
              </View>
            ) : (
              txTarjeta.map((tx) => (
                <View
                  key={tx.id}
                  className="p-4 bg-white rounded-2xl border border-slate-100 flex-row justify-between items-center shadow-sm mb-3"
                >
                  <View>
                    {/* nombre de la compra */}
                    {/* ojo: "font  bold" no existe como clase, deberia ser font-inter-bold */}
                    <Text className="text-slate-900 text-base font  bold">{tx.motivo}</Text>
                    {/* en que cuota va y el total, toLocaleString('es-CL') pone los puntos de miles */}
                    <Text className="text-slate-400 text-xs font-inter-medium">
                      Cuota {tx.cuotaActual} de {tx.totalCuotas} (Total: ${tx.montoTotal.toLocaleString('es-CL')})
                    </Text>
                  </View>
                  {/* lo que se paga al mes por esta compra */}
                  <Text className="text-slate-900 text-base font-inter-bold">
                    ${tx.cuotaMensual.toLocaleString('es-CL')}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* boton para pagar el mes, llama a handleMarcarPagado */}
          <TouchableOpacity
            onPress={handleMarcarPagado}
            activeOpacity={0.8}
            className="w-full h-12 bg-color-action rounded-2xl items-center justify-center mb-8 shadow-sm"
          >
            <Text className="text-white text-base font-inter-bold">Marcar Mes como Pagado</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
