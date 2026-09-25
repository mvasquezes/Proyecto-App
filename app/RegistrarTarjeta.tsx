import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CardItem from '../components/TarjetaGrande';
import { BankOption, LISTA_BANCOS } from '../constants/banks';
import { TarjetaItem, useApp } from '../context/AppContext';

export default function NuevaTarjetaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { agregarTarjeta } = useApp();

  const [bancoSeleccionado, setBancoSeleccionado] = useState<BankOption>(LISTA_BANCOS[0]);
  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [dia, setDia] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');



  // Evaluamos si el banco seleccionado permite personalizar nombre
  const permiteEditarNombre = bancoSeleccionado.id === 'visa' || bancoSeleccionado.id === 'mastercard';

  // El nombre visible es el personalizado si aplica, o el nombre del banco fijo
  const nombreFinal = permiteEditarNombre 
    ? (nombrePersonalizado || bancoSeleccionado.nombre)
    : bancoSeleccionado.nombre;

  /*useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#0F172A');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);*/

  // Previsualización dinámica sin monto ingresado manualmente
  const previewItem: TarjetaItem = {
    id: 'preview',
    banco: nombreFinal,
    nombre: nombreFinal,
    monto: '$0',
    vencimiento: dia ? `${dia} de este mes` : 'Fecha de corte',
    colorHex: bancoSeleccionado.colorHex,
  };

const handleGuardar = () => {
  const diaNumero = parseInt(dia, 10);

  // Validación: que exista, que sea número y que esté entre 1 y 31
  if (!dia.trim() || isNaN(diaNumero) || diaNumero < 1 || diaNumero > 31) {
    Alert.alert(
      'Día inválido',
      'Por favor ingresa un día de facturación válido entre 1 y 31.'
    );
    return;
  }

    agregarTarjeta({
      id: Date.now().toString(),
      banco: nombreFinal,
      nombre: nombreFinal,
      vencimiento: `${diaNumero} de este mes`,
      colorHex: bancoSeleccionado.colorHex,
    });

  router.replace('/Tarjetas');
};

  const bancosFiltrados = LISTA_BANCOS.filter(b => 
    b.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View 
      className="flex-1 bg-color-menu" 
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom 
      }}
    >
      <View className="flex-1 bg-white">
        {/* Encabezado */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between border-b border-slate-100">
          <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-bold">
            Formulario Nueva Tarjeta
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Previsualización en vivo */}
          <View className="pt-4 pb-4">
            <CardItem item={previewItem} />
          </View>

          {/* Selector de Banco */}
          <View className="mb-4">
            <Text className="text-black text-base font-bold mb-1">Emisor / Banco</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-slate-900 text-sm font-semibold">
                {bancoSeleccionado.nombre}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Nombre de Tarjeta: Se muestra solo para Visa y MasterCard */}
          {permiteEditarNombre && (
            <View className="mb-4">
              <Text className="text-black text-base font-bold mb-1">Nombre de la Tarjeta</Text>
              <TextInput
                value={nombrePersonalizado}
                onChangeText={setNombrePersonalizado}
                placeholder={`Ej: ${bancoSeleccionado.nombre} Black / Platinum`}
                placeholderTextColor="#94A3B8"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
              />
            </View>
          )}
        {/* Día Vencimiento */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-1">
            Día de Facturación / Vencimiento
          </Text>
          <TextInput
            value={dia}
            onChangeText={(texto) => {
              // 1. Limpiar caracteres no numéricos
              const soloNumeros = texto.replace(/[^0-9]/g, '');
              
              // 2. Si lo deja vacío, permitir borrar
              if (soloNumeros === '') {
                setDia('');
                return;
              }

              // 3. Impedir que escriba un número superior a 31
              const num = parseInt(soloNumeros, 10);
              if (num <= 31) {
                setDia(soloNumeros);
              }
            }}
            keyboardType="numeric"
            maxLength={2}
            placeholder="Seleccionar día (1 - 31)"
            placeholderTextColor="#94A3B8"
            className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
          />
        </View>

          {/* Botón Guardar */}
          <TouchableOpacity
            onPress={handleGuardar}
            className="w-full h-12 bg-color-action rounded-2xl items-center justify-center mb-8 shadow-md"
            activeOpacity={0.8}
          >
            <Text className="text-white text-base font-bold">
              Guardar Tarjeta
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal Selección de Banco */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-slate-50 rounded-t-3xl max-h-[80%] p-6">
              <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
                <Text className="text-slate-800 text-lg font-bold">Seleccionar Banco</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <View className="my-4 h-12 px-4 bg-white rounded-2xl border border-slate-200 flex-row items-center">
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput
                  value={busqueda}
                  onChangeText={setBusqueda}
                  placeholder="Buscar banco o emisor..."
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-slate-800 ml-2"
                />
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {bancosFiltrados.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setBancoSeleccionado(item);
                      setNombrePersonalizado(''); // resetea el nombre previo al cambiar emisor
                      setModalVisible(false);
                    }}
                    className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
                  >
                    <Text className="text-slate-900 text-base font-semibold">
                      {item.nombre}
                    </Text>
                    {bancoSeleccionado.id === item.id ? (
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