<<<<<<< HEAD
=======
// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// para cambiar el color de la barra de navegacion de android (la de los botones de abajo)
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import * as NavigationBar from 'expo-navigation-bar';
// useLocalSearchParams lee los parametros de la ruta, en este caso el id
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

<<<<<<< HEAD
import PantallaFormulario from '../../components/PantallaFormulario';
import SuscripcionFila from '../../components/SuscripcionFila';
import CardItem from '../../components/TarjetaGrande';
import { avisar, confirmar } from '../../constants/alertas';
import { montoDeCuota } from '../../constants/cuotas';
import { claveMes, nombreMesDeClave } from '../../constants/fechas';
import { formatearCLP } from '../../constants/formato';
import { RUTAS } from '../../constants/rutas';
=======
// la tarjeta grande de arriba
import CardItem from '../../components/TarjetaGrande';
// datos y funciones del contexto
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import { useApp } from '../../context/AppContext';

export default function DetalleTarjetaScreen() {
  // saca el id que viene en la ruta, ej: /detalle-tarjeta/1727630000000
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
<<<<<<< HEAD
  const { tarjetas, transacciones, suscripciones, pagarMesTarjeta } = useApp();

=======
  const insets = useSafeAreaInsets();
  // tarjetas, compras y la funcion para pagar el mes
  const { tarjetas, transacciones, pagarMesTarjeta } = useApp();
  // busca la tarjeta que tiene ese id
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  const tarjeta = tarjetas.find((t) => t.id === id);
  // se queda solo con las compras de esta tarjeta
  const txTarjeta = transacciones.filter((tx) => tx.tarjetaId === id);
  const mesActual = claveMes();

<<<<<<< HEAD
  // Solo las suscripciones pendientes de este mes: al pagar el mes desaparecen y vuelven el mes siguiente
  const subsTarjeta = suscripciones.filter((s) => s.tarjetaId === id && !s.pagadaEsteMes);
  const totalSubs = subsTarjeta.reduce((acc, s) => acc + s.monto, 0);

  // Color de la barra de navegación de Android (solo móvil)
=======
  // se ejecuta una sola vez al abrir la pantalla (por el [] vacio)
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
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
          onPress={() => router.replace(RUTAS.tarjetas)}
          className="px-5 py-2.5 bg-color-action rounded-xl">
          <Text className="text-white font-inter-bold">Volver a Tarjetas</Text>
        </TouchableOpacity>
      </View>
    );
  }

<<<<<<< HEAD
  /**
   * Registra el pago del mes: avanza una cuota en cada compra,
   * quita las que terminan, marca las suscripciones como pagadas y libera el cupo.
   * Solo se puede una vez por mes en cada tarjeta.
   */
  const handleMarcarPagado = () => {
    // Ya se pagó este mes: evita avanzar las cuotas dos veces
    if (tarjeta.pagadaEsteMes) {
      avisar('Mes ya pagado', 'Ya registraste el pago de este mes en esta tarjeta. Podrás volver a pagar el próximo mes.');
      return;
    }

    // Nada por pagar este mes (ni cuotas ni suscripciones)
    if (tarjeta.montoNumerico === 0) {
      avisar('Al día', 'Esta tarjeta no tiene pagos pendientes este mes.');
      return;
    }

    // `montoNumerico` ya incluye cuotas + suscripciones pendientes
    const montoMes = formatearCLP(tarjeta.montoNumerico);

    confirmar({
      titulo: 'Registrar pago del mes',
      mensaje:
        `Se registrará el pago de ${montoMes}. Cada compra avanzará una cuota (las que estén en su última cuota saldrán del resumen) ` +
        `y las suscripciones quedarán pagadas este mes y volverán a cobrarse el próximo. Ese monto se liberará de tu cupo disponible.`,
      textoConfirmar: 'Confirmar pago',
      onConfirmar: () => {
        if (pagarMesTarjeta(tarjeta.id)) {
          avisar('Pago registrado', `Pagaste ${montoMes}. Tu cupo disponible aumentó.`);
        }
      },
    });
  };

  return (
    <PantallaFormulario titulo="Detalle Tarjeta" onVolver={() => router.back()}>
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Tarjeta superior con datos dinámicos */}
        <CardItem item={tarjeta} />

        {/* Cargos y Compras en Cuotas */}
        <View className="mt-2 mb-6">
          <Text className="text-slate-900 text-base font-inter-bold mb-3">
            Cargos y Compras en Cuotas
          </Text>

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
                  <Text className="text-slate-900 text-base font-inter-bold">{tx.motivo}</Text>
                  <Text className="text-slate-400 text-xs font-inter-medium">
                    Cuota {tx.cuotaActual} de {tx.totalCuotas} (Total: {formatearCLP(tx.montoTotal)})
                  </Text>
                  {/* Compra hecha después del corte: aún no suma al total de este mes */}
                  {tx.mesInicio > mesActual && (
                    <Text className="text-amber-600 text-[11px] font-inter-medium mt-0.5">
                      Se cobra desde {nombreMesDeClave(tx.mesInicio)}
                    </Text>
                  )}
                </View>
                {/* La última cuota puede valer distinto: absorbe el redondeo */}
                <Text className="text-slate-900 text-base font-inter-bold">
                  {formatearCLP(montoDeCuota(tx, tx.cuotaActual))}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Suscripciones asociadas a esta tarjeta */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-slate-900 text-base font-inter-bold">Suscripciones</Text>
            {subsTarjeta.length > 0 && (
              <View className="flex-row items-baseline px-3 py-1.5 bg-white rounded-full border border-slate-100">
                <Text className="text-slate-900 text-xs font-inter-bold">{formatearCLP(totalSubs)}</Text>
                <Text className="text-slate-400 text-[10px] font-inter-regular"> /mes</Text>
              </View>
            )}
          </View>

          {subsTarjeta.length === 0 ? (
            <View className="p-4 rounded-2xl border border-dashed border-slate-200 items-center justify-center">
              <Text className="text-slate-400 text-xs">Sin suscripciones pendientes este mes</Text>
            </View>
          ) : (
            subsTarjeta.map((s) => <SuscripcionFila key={s.id} item={s} ocultarTarjeta />)
          )}
        </View>

        {/* Botón: Registrar Pago del Mes */}
        <TouchableOpacity
          onPress={handleMarcarPagado}
          activeOpacity={0.8}
          disabled={tarjeta.pagadaEsteMes}
          className={`w-full h-12 rounded-2xl items-center justify-center mb-8 shadow-sm ${
            tarjeta.pagadaEsteMes ? 'bg-slate-300' : 'bg-color-action'
          }`}
        >
          <Text className="text-white text-base font-inter-bold">
            {tarjeta.pagadaEsteMes ? 'Mes pagado' : 'Registrar Pago del Mes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </PantallaFormulario>
=======
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
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  );
}
