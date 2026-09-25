import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TarjetaItem, useApp } from '../context/AppContext';

export default function NuevaTransaccionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tarjetas, registrarTransaccion } = useApp();

  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<TarjetaItem | null>(
    tarjetas.length > 0 ? tarjetas[0] : null
  );
  const [motivo, setMotivo] = useState('');
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0F172A');
      NavigationBar.setButtonStyleAsync('light');
    }

    // Si no hay tarjetas, obligar a registrar una primero
    if (tarjetas.length === 0) {
      Alert.alert(
        'Sin tarjetas',
        'Debes registrar al menos una tarjeta antes de agregar una facturación o compra.',
        [
          {
            text: 'Crear Tarjeta',
            onPress: () => router.replace('/RegistrarTarjeta'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => router.replace('/'),
          },
        ]
      );
    }
  }, [tarjetas]);

  const handleGuardar = () => {
    if (!tarjetaSeleccionada) {
      Alert.alert('Error', 'Selecciona una tarjeta para asignar la facturación.');
      return;
    }

    if (!motivo.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa un motivo para la compra.');
      return;
    }

    const montoLimpio = parseInt(monto.replace(/[^0-9]/g, ''), 10);
    if (isNaN(montoLimpio) || montoLimpio <= 0) {
      Alert.alert('Monto inválido', 'Por favor ingresa un monto mayor a cero.');
      return;
    }

    const numCuotas = parseInt(cuotas.replace(/[^0-9]/g, ''), 10) || 1;

    registrarTransaccion(
      tarjetaSeleccionada.id,
      motivo.trim(),
      montoLimpio,
      numCuotas
    );

    Alert.alert('Éxito', 'Facturación agregada con éxito.', [
      { text: 'OK', onPress: () => router.replace('/') },
    ]);
  };

  return (
    <View
      className="flex-1 bg-color-menu"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 bg-white">
        {/* Encabezado */}
        <View className="px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100">
          <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-bold">
            Transacciones
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* 1. Ingrese Tarjeta */}
          <View className="mb-5">
            <Text className="text-black text-base font-bold mb-1.5">Ingrese tarjeta</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-slate-900 text-sm font-semibold">
                {tarjetaSeleccionada
                  ? `${tarjetaSeleccionada.banco} - ${tarjetaSeleccionada.nombre}`
                  : 'Selecciona una tarjeta'}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* 2. Ingrese Motivo */}
          <View className="mb-5">
            <Text className="text-black text-base font-bold mb-1.5">Ingrese motivo</Text>
            <TextInput
              value={motivo}
              onChangeText={setMotivo}
              placeholder="Ejemplo: Compra ropa Ripley"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* 3. Ingrese Monto */}
          <View className="mb-5">
            <Text className="text-black text-base font-bold mb-1.5">Ingrese monto</Text>
            <TextInput
              value={monto}
              onChangeText={(txt) => setMonto(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="$30.000"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* 4. Ingrese Cantidad Cuotas */}
          <View className="mb-8">
            <Text className="text-black text-base font-bold mb-1.5">Ingrese cantidad cuotas</Text>
            <TextInput
              value={cuotas}
              onChangeText={(txt) => setCuotas(txt.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="Ingresar cantidad de cuotas (ej. 1)"
              placeholderTextColor="#94A3B8"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
            />
          </View>

          {/* Botón Agregar Facturación */}
          <TouchableOpacity
            onPress={handleGuardar}
            className="w-full h-12 bg-emerald-500 rounded-2xl items-center justify-center mb-8 shadow-md"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">
              Agregar Transacción
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal Selección de Tarjetas Registradas */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-slate-50 rounded-t-3xl max-h-[70%] p-6">
              <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
                <Text className="text-slate-800 text-lg font-bold">Seleccionar Tarjeta</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
                {tarjetas.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => {
                      setTarjetaSeleccionada(t);
                      setModalVisible(false);
                    }}
                    className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: t.colorHex }}
                      />
                      <View>
                        <Text className="text-slate-900 text-base font-semibold">
                          {t.banco}
                        </Text>
                        <Text className="text-slate-500 text-xs">
                          Actual: {t.monto}
                        </Text>
                      </View>
                    </View>
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