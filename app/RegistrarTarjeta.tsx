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
  const[alias, setAlias] = useState('');
  const[cupo, setCupo] = useState('');
  const [dia, setDia] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

// 1. Identificamos si es una tarjeta genérica que obliga a usar alias
  const requiereAlias = bancoSeleccionado.id === 'visa' || bancoSeleccionado.id === 'mastercard';

// 2. Definimos qué título se mostrará en grande en la tarjeta gráfica
  const tituloTarjeta = requiereAlias && alias.trim() !== '' 
    ? alias.trim() 
    : bancoSeleccionado.nombre;


const cupoNumerico = parseInt(cupo.replace(/[^0-9]/g, ''), 10) || 0;

  // Previsualización dinámica
const previewItem: TarjetaItem = {
    id: 'preview',
    banco: tituloTarjeta,
    nombre: tituloTarjeta,
    alias: alias || 'Sin alias',
    monto: '$0',
    montoNumerico: 0,
    diaVencimiento: parseInt(dia, 10) || 1,
    estadoVencimiento: '',
    vencimiento: dia ? `${dia} de este mes` : 'Fecha de corte',
    colorHex: bancoSeleccionado.colorHex,
    cupoTotal: cupoNumerico,
    cupoDisponible: cupoNumerico,
  };

const handleGuardar = () => {
    // === VALIDACIONES ===
    
    // A) Validación del Alias Obligatorio para Visa/Mastercard
    if (requiereAlias && !alias.trim()) {
      Alert.alert(
        'Alias obligatorio', 
        `Por favor ingresa un nombre para identificar tu tarjeta ${bancoSeleccionado.nombre} (Ej: Visa Platinum).`
      );
      return;
    }

    // B) Validación del Día
    const diaNumero = parseInt(dia, 10);
    if (!dia.trim() || isNaN(diaNumero) || diaNumero < 1 || diaNumero > 31) {
      Alert.alert('Día inválido', 'Por favor ingresa un día de facturación válido entre 1 y 31.');
      return;
    }

    // C) Validación del Cupo
    if (cupoNumerico <= 0) {
      Alert.alert('Cupo inválido', 'Por favor ingresa un cupo total mayor a 0.');
      return;
    }

    // === GUARDADO ===
    
    // Si el alias está vacío (solo posible en bancos principales), usa el nombre del banco
    const aliasFinal = alias.trim() !== '' ? alias.trim() : bancoSeleccionado.nombre;

    agregarTarjeta({
      id: Date.now().toString(),
      banco: tituloTarjeta, // Título principal de la tarjeta
      nombre: tituloTarjeta, 
      alias: aliasFinal,    // Nombre interno
      diaVencimiento: diaNumero,
      colorHex: bancoSeleccionado.colorHex,
      cupoTotal: cupoNumerico,
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
          <Text className="text-slate-600 text-base font-inter-bold">
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
            <Text className="text-black text-base font-inter-bold mb-1">Emisor / Banco</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-slate-900 text-sm font-inter-medium">
                {bancoSeleccionado.nombre}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="text-black text-base font-inter-bold mb-1">
              Alias de la Tarjeta {requiereAlias ? '(Obligatorio)' : '(Opcional)'}
            </Text>
            <TextInput
              value={alias}
              onChangeText={setAlias}
              placeholder={
                requiereAlias
                  ? `Ej: ${bancoSeleccionado.nombre} Platinum`
                  : 'Ej: Tarjeta del trabajo (opcional)'
              }
              placeholderTextColor="#94A3B8"
              className={`w-full h-12 px-4 bg-slate-50 border rounded-xl text-slate-800 font-inter-medium ${
                requiereAlias && !alias.trim() ? 'border-red-300' : 'border-slate-300'
              }`}
            />
          </View>


        {/* Campo Cupo Total */}
                  <View className="mb-5">
                    <Text className="text-black text-base font-inter-bold mb-1.5">Cupo Total</Text>
                    <TextInput
                      value={cupo}
                      onChangeText={(txt) => setCupo(txt.replace(/[^0-9]/g, ''))}
                      keyboardType="numeric"
                      placeholder="$300.000"
                      placeholderTextColor="#94A3B8"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-inter-medium"
                    />
                  </View>

        {/* Día Vencimiento */}
        <View className="mb-8">
          <Text className="text-black text-base font-inter-bold mb-1">
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
            <Text className="text-white text-base font-inter-bold">
              Guardar Tarjeta
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal Selección de Banco */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-slate-50 rounded-t-3xl max-h-[80%] p-6">
              <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
                <Text className="text-slate-800 text-lg font-inter-bold">Seleccionar Banco</Text>
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
                      setAlias(''); 
                      setModalVisible(false);
                    }}
                    className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
                  >
                    <Text className="text-slate-900 text-base font-inter-medium">
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