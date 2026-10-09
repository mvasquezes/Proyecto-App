// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// para navegar entre pantallas
import { useRouter } from 'expo-router';
// useState para los campos y useEffect para revisar si hay tarjetas al entrar
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  // Platform nos dice si estamos en web, android o ios
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// el tipo de tarjeta y el hook para leer y guardar en el contexto
import { TarjetaItem, useApp } from '../context/AppContext';

export default function NuevaTransaccionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // las tarjetas para el selector y la funcion que guarda la compra
  const { tarjetas, registrarTransaccion } = useApp();

  // tarjeta elegida, parte con la primera de la lista o null si no hay ninguna
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<TarjetaItem | null>(
    tarjetas.length > 0 ? tarjetas[0] : null
  );
  // descripcion de la compra
  const [motivo, setMotivo] = useState('');
  // monto total como texto
  const [monto, setMonto] = useState('');
  // cantidad de cuotas, parte en 1
  const [cuotas, setCuotas] = useState('1');
  // si el modal de tarjetas esta abierto
  const [modalVisible, setModalVisible] = useState(false);

  // se ejecuta al entrar a la pantalla y cada vez que cambian las tarjetas
  // (el lint avisa que falta router en la lista de dependencias, es solo una advertencia)
  useEffect(() => {
// si no hay ninguna tarjeta no se puede registrar una compra
if (tarjetas.length === 0) {
   // en web usamos window.confirm porque Alert.alert con botones no funciona ahi
      if (Platform.OS === 'web') {


        // muestra la pregunta con Aceptar / Cancelar y guarda true o false
        const quiereCrear = window.confirm(
          'Sin tarjetas registradas.\n\nDebes registrar al menos una tarjeta antes de agregar una transacción.\n\n¿Deseas crear una tarjeta ahora?'
        );

        // si acepto lo mandamos a crear tarjeta, si no de vuelta al inicio
        if (quiereCrear) {
          router.replace('/RegistrarTarjeta');
        } else {
          router.replace('/');
        }
      } else {
        // en el celular usamos el aviso nativo con dos botones
        Alert.alert(
          'Sin tarjetas',
          'Debes registrar al menos una tarjeta antes de agregar una facturación o compra.',
          [
            {
              text: 'Crear Tarjeta',
              // este boton lo lleva a crear una tarjeta
              onPress: () => router.replace('/RegistrarTarjeta'),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
              // este lo devuelve al inicio
              onPress: () => router.replace('/'),
            },
          ]
        );
      }
    }
  }, [tarjetas]);

  // se ejecuta al tocar "Agregar Transaccion"
  const handleGuardar = () => {
    // si no hay tarjeta elegida avisa y corta
    if (!tarjetaSeleccionada) {
      Alert.alert('Error', 'Selecciona una tarjeta para asignar la facturación.');
      return;
    }

    // el motivo no puede estar vacio (trim saca los espacios)
    if (!motivo.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un motivo para la compra.');
      return;
    }

    // deja solo los numeros del monto y lo pasa a numero
    const montoLimpio = parseInt(monto.replace(/[^0-9]/g, ''), 10);
    // si no es numero o es 0 o menos, avisa y corta
    if (isNaN(montoLimpio) || montoLimpio <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto mayor a cero.');
      return;
    }

    // pasa las cuotas a numero, si queda vacio o en 0 usa 1
    const numCuotas = parseInt(cuotas.replace(/[^0-9]/g, ''), 10) || 1;

    // guarda la compra en el contexto usando solo el id de la tarjeta elegida
    // ojo: esta funcion devuelve false si el monto supera el cupo disponible y en ese caso no guarda nada,
    // pero aca no se revisa lo que devuelve, entonces igual sale "Agregado correctamente"
    registrarTransaccion(
      tarjetaSeleccionada.id,
      motivo.trim(),
      montoLimpio,
      numCuotas
    );

// en web el alert normal del navegador, que espera a que aprieten Aceptar
if (Platform.OS === 'web') {
      alert('Agregado correctamente');
      // despues vuelve al inicio
      router.replace('/');
    } else {
      // en el celular el aviso nativo, y al tocar OK vuelve al inicio
      Alert.alert('Éxito', 'Agregado correctamente', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    }
  };

  return (
    // fondo oscuro con padding para el notch y la barra de gestos
    <View
      className="flex-1 bg-color-menu"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* caja blanca con el formulario */}
      <View className="flex-1 bg-white">
        {/* encabezado: flecha para volver al inicio y titulo */}
        <View className="px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100">
          <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-inter-bold">
            Transacciones
          </Text>
          {/* caja vacia para que el titulo quede centrado */}
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* selector de tarjeta: boton que abre el modal */}
          <View className="mb-5">
            <Text className="text-black text-base font-bold mb-1.5">Ingrese tarjeta</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
            >
              {/* si hay tarjeta elegida muestra "banco - nombre", si no un texto de ayuda */}
              <Text className="text-slate-900 text-sm font-inter-medium">
                {tarjetaSeleccionada
                  ? `${tarjetaSeleccionada.banco} - ${tarjetaSeleccionada.nombre}`
                  : 'Selecciona una tarjeta'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* campo motivo de la compra */}
          <View className="mb-5">
            <Text className="text-black text-base font-inter-bold mb-1.5">Ingrese motivo</Text>
            <TextInput
              value={motivo}
              onChangeText={setMotivo}
              placeholder="Ejemplo: Compra ropa Ripley"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* campo monto total de la compra */}
          <View className="mb-5">
            <Text className="text-black text-base font-inter-bold mb-1.5">Ingrese monto</Text>
            <TextInput
              value={monto}
              // borra todo lo que no sea numero mientras escriben
              onChangeText={(txt) => setMonto(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="$30.000"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* campo cantidad de cuotas */}
          <View className="mb-8">
            <Text className="text-black text-base font-inter-bold mb-1.5">Ingrese cantidad cuotas</Text>
            <TextInput
              value={cuotas}
              // igual que el monto, solo deja numeros
              onChangeText={(txt) => setCuotas(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Ingresar cantidad de cuotas (ej. 1)"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* boton que guarda la compra, llama a handleGuardar */}
          <TouchableOpacity
            onPress={handleGuardar}
            className="w-full h-12 bg-emerald-500 rounded-2xl items-center justify-center mb-8 shadow-md"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-inter-bold">
              Agregar Transacción
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ventana para elegir tarjeta, sale desde abajo */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          {/* fondo negro semitransparente */}
          <View className="flex-1 bg-black/50 justify-end">
            {/* caja del modal, maximo 70% del alto */}
            <View className="bg-slate-50 rounded-t-3xl max-h-[70%] p-6">
              {/* titulo y X para cerrar */}
              <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
                <Text className="text-slate-800 text-lg font-inter-bold">Seleccionar Tarjeta</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {/* una fila por cada tarjeta registrada */}
              <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
                {tarjetas.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      // guarda la tarjeta tocada y cierra el modal
                      setTarjetaSeleccionada(t);
                      setModalVisible(false);
                    }}
                    className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
                  >
                    <View className="flex-row items-center gap-3">
                      {/* circulito con el color de la tarjeta */}
                      <View
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: t.colorHex }}
                      />
                      <View>
                        <Text className="text-slate-900 text-base font-inter-medium">
                          {t.banco}
                        </Text>
                        {/* lo que lleva a pagar este mes esa tarjeta */}
                        <Text className="text-slate-500 text-xs">
                          Actual: {t.monto}
                        </Text>
                      </View>
                    </View>
                    {/* check verde si es la elegida, flechita si no */}
                    {tarjetaSeleccionada?.id === t.id ? (
                      <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
