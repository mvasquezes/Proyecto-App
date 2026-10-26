import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CampoFormulario, estiloInput, SelectorCampo } from '../components/CampoFormulario';
import ModalSeleccion, { FilaOpcion } from '../components/ModalSeleccion';
import PantallaFormulario from '../components/PantallaFormulario';
import CardItem from '../components/TarjetaGrande';
import { avisar } from '../constants/alertas';
import { BankOption, LISTA_BANCOS } from '../constants/banks';
import { formatearMiles, soloDigitos } from '../constants/formato';
import { generarId } from '../constants/id';
import { RUTAS } from '../constants/rutas';
import { TarjetaItem, useApp } from '../context/AppContext';

export default function NuevaTarjetaScreen() {
  const router = useRouter();
  const { agregarTarjeta } = useApp();

  const [bancoSeleccionado, setBancoSeleccionado] = useState<BankOption>(LISTA_BANCOS[0]);
  const [alias, setAlias] = useState('');
  const [cupo, setCupo] = useState('');   // Solo dígitos; se muestra con puntos de miles
  const [dia, setDia] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // 1. Identificamos si es una tarjeta genérica que obliga a usar alias
  const requiereAlias = bancoSeleccionado.id === 'visa' || bancoSeleccionado.id === 'mastercard';

  // 2. Definimos qué título se mostrará en grande en la tarjeta gráfica
  const tituloTarjeta = requiereAlias && alias.trim() !== ''
    ? alias.trim()
    : bancoSeleccionado.nombre;

  const cupoNumerico = parseInt(cupo, 10) || 0;

  // Previsualización dinámica: la tarjeta se va armando mientras el usuario escribe
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
    pagadaEsteMes: false,
  };

  const handleGuardar = () => {
    // === VALIDACIONES ===

    // A) Validación del Alias Obligatorio para Visa/Mastercard
    if (requiereAlias && !alias.trim()) {
      avisar(
        'Alias obligatorio',
        `Por favor ingresa un nombre para identificar tu tarjeta ${bancoSeleccionado.nombre} (Ej: Visa Platinum).`
      );
      return;
    }

    // B) Validación del Día
    const diaNumero = parseInt(dia, 10);
    if (!dia.trim() || isNaN(diaNumero) || diaNumero < 1 || diaNumero > 31) {
      avisar('Día inválido', 'Por favor ingresa un día de facturación válido entre 1 y 31.');
      return;
    }

    // C) Validación del Cupo
    if (cupoNumerico <= 0) {
      avisar('Cupo inválido', 'Por favor ingresa un cupo total mayor a 0.');
      return;
    }

    // === GUARDADO ===

    // Si el alias está vacío (solo posible en bancos principales), usa el nombre del banco
    const aliasFinal = alias.trim() !== '' ? alias.trim() : bancoSeleccionado.nombre;

    agregarTarjeta({
      id: generarId(),
      banco: tituloTarjeta, // Título principal de la tarjeta
      nombre: tituloTarjeta,
      alias: aliasFinal,    // Nombre interno
      diaVencimiento: diaNumero,
      colorHex: bancoSeleccionado.colorHex,
      cupoTotal: cupoNumerico,
    });

    router.replace(RUTAS.tarjetas);
  };

  const bancosFiltrados = LISTA_BANCOS.filter((b) =>
    b.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Día de facturación: solo números y nunca mayor a 31
  const handleCambioDia = (texto: string) => {
    const soloNumeros = soloDigitos(texto);

    // Si lo deja vacío, permitir borrar
    if (soloNumeros === '') {
      setDia('');
      return;
    }

    // Impedir que escriba un número superior a 31
    if (parseInt(soloNumeros, 10) <= 31) {
      setDia(soloNumeros);
    }
  };

  return (
    <PantallaFormulario titulo="Formulario Nueva Tarjeta" onVolver={() => router.replace(RUTAS.inicio)}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Previsualización en vivo */}
        <View className="pt-4 pb-4">
          <CardItem item={previewItem} />
        </View>

        {/* Selector de Banco */}
        <CampoFormulario etiqueta="Emisor / Banco">
          <SelectorCampo onPress={() => setModalVisible(true)}>
            <Text className="text-slate-900 text-sm font-inter-medium">
              {bancoSeleccionado.nombre}
            </Text>
          </SelectorCampo>
        </CampoFormulario>

        {/* Alias (obligatorio solo en Visa / MasterCard) */}
        <CampoFormulario etiqueta={`Alias de la Tarjeta ${requiereAlias ? '(Obligatorio)' : '(Opcional)'}`}>
          <TextInput
            value={alias}
            onChangeText={setAlias}
            placeholder={
              requiereAlias
                ? `Ej: ${bancoSeleccionado.nombre} Platinum`
                : 'Ej: Tarjeta del trabajo (opcional)'
            }
            placeholderTextColor="#94A3B8"
            className={estiloInput(requiereAlias && !alias.trim())}
          />
        </CampoFormulario>

        {/* Cupo Total */}
        <CampoFormulario etiqueta="Cupo Total">
          <TextInput
            value={formatearMiles(cupo)}
            onChangeText={(txt) => setCupo(soloDigitos(txt))}
            keyboardType="numeric"
            placeholder="$300.000"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

        {/* Día Vencimiento */}
        <CampoFormulario etiqueta="Día de Facturación / Vencimiento" className="mb-8">
          <TextInput
            value={dia}
            onChangeText={handleCambioDia}
            keyboardType="numeric"
            maxLength={2}
            placeholder="Seleccionar día (1 - 31)"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

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

      {/* Modal Selección de Banco (con buscador) */}
      <ModalSeleccion
        visible={modalVisible}
        titulo="Seleccionar Banco"
        alturaMax="max-h-[80%]"
        onCerrar={() => setModalVisible(false)}
        encabezadoExtra={
          <View className="mt-4 h-12 px-4 bg-white rounded-2xl border border-slate-200 flex-row items-center">
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar banco o emisor..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-slate-800 ml-2"
            />
          </View>
        }
      >
        {bancosFiltrados.map((item) => (
          <FilaOpcion
            key={item.id}
            seleccionada={bancoSeleccionado.id === item.id}
            onPress={() => {
              setBancoSeleccionado(item);
              setAlias(''); // El alias depende del banco elegido
              setModalVisible(false);
            }}
          >
            <Text className="text-slate-900 text-base font-inter-medium">{item.nombre}</Text>
          </FilaOpcion>
        ))}
      </ModalSeleccion>
    </PantallaFormulario>
  );
}
