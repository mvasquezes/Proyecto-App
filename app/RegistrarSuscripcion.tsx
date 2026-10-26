import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CampoFormulario, estiloInput, SelectorCampo } from '../components/CampoFormulario';
import ModalSeleccion, { FilaOpcion } from '../components/ModalSeleccion';
import PantallaFormulario from '../components/PantallaFormulario';
import { colorSuscripcion } from '../components/SuscripcionFila';
import { avisar } from '../constants/alertas';
import { formatearCLP, formatearMiles, soloDigitos } from '../constants/formato';
import { generarId } from '../constants/id';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';
import { useRequerirTarjetas } from '../hooks/useRequerirTarjetas';

// Servicios que se pueden elegir con un toque para rellenar el nombre
const SUGERIDAS = ['Netflix', 'Spotify', 'Disney+', 'YouTube Premium', 'Amazon Prime', 'HBO Max', 'iCloud', 'ChatGPT'];

export default function NuevaSuscripcionScreen() {
  const router = useRouter();
  const { tarjetas, agregarSuscripcion } = useApp();

  // Sin tarjetas no se puede registrar una suscripción: ofrece crear una
  useRequerirTarjetas('suscripción', RUTAS.suscripciones);

  // La tarjeta es obligatoria: por defecto, la primera registrada.
  // Se guarda solo el id y la tarjeta se busca en cada render para tener el cupo actualizado.
  const [tarjetaId, setTarjetaId] = useState<string>(tarjetas[0]?.id ?? '');
  const tarjetaSeleccionada = tarjetas.find((t) => t.id === tarjetaId) ?? null;

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [plan, setPlan] = useState('');
  const [monto, setMonto] = useState('');   // Solo dígitos; se muestra con puntos de miles

  const montoNumerico = parseInt(monto, 10) || 0;

  const handleGuardar = () => {
    if (!tarjetaSeleccionada) return avisar('Tarjeta requerida', 'Selecciona la tarjeta a la que se cobra la suscripción.');
    if (!nombre.trim()) return avisar('Campo requerido', 'Ingresa el nombre del servicio.');
    if (montoNumerico <= 0) return avisar('Monto inválido', 'Ingresa un monto mensual mayor a cero.');

    // El día de cobro no se pide: la suscripción se cobra el día de vencimiento de la tarjeta
    const resultado = agregarSuscripcion({
      id: generarId(),
      nombre: nombre.trim(),
      plan: plan.trim(),
      monto: montoNumerico,
      tarjetaId: tarjetaSeleccionada.id,
    });

    if (resultado === 'sin_cupo') {
      return avisar(
        'Cupo insuficiente',
        `El monto (${formatearCLP(montoNumerico)}) supera el cupo disponible de ${tarjetaSeleccionada.banco} (${formatearCLP(tarjetaSeleccionada.cupoDisponible)}).`
      );
    }
    if (resultado === 'sin_tarjeta') return avisar('Error', 'La tarjeta seleccionada ya no existe.');

    router.replace(RUTAS.suscripciones);
  };

  return (
    <PantallaFormulario titulo="Nueva Suscripción" onVolver={() => router.replace(RUTAS.suscripciones)}>
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Tarjeta asociada (obligatoria) */}
        <CampoFormulario etiqueta="Tarjeta asociada">
          <SelectorCampo onPress={() => setModalVisible(true)}>
            {tarjetaSeleccionada && (
              <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tarjetaSeleccionada.colorHex }} />
            )}
            <Text className="text-slate-900 text-sm font-inter-medium">
              {tarjetaSeleccionada ? tarjetaSeleccionada.banco : 'Selecciona una tarjeta'}
            </Text>
          </SelectorCampo>
        </CampoFormulario>

        {/* Sugerencias rápidas */}
        <Text className="text-black text-base font-inter-bold mb-2">Servicios populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="mb-5 flex-grow-0">
          {SUGERIDAS.map((n) => {
            const sel = nombre === n;
            return (
              <TouchableOpacity
                key={n}
                onPress={() => setNombre(n)}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-full border ${sel ? 'bg-color-menu border-color-menu' : 'bg-slate-50 border-slate-200'}`}
              >
                <Text className={`text-xs font-inter-medium ${sel ? 'text-white' : 'text-slate-600'}`}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Nombre (con avatar de color que se actualiza al escribir) */}
        <CampoFormulario etiqueta="Servicio">
          <View className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center">
            {nombre.trim() !== '' && (
              <View
                className="w-6 h-6 rounded-md items-center justify-center mr-2"
                style={{ backgroundColor: colorSuscripcion(nombre.trim()) }}
              >
                <Text className="text-white text-xs font-inter-bold">{nombre.trim().charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ejemplo: Netflix"
              placeholderTextColor="#94A3B8"
              className="flex-1 text-slate-800 font-inter-medium"
            />
          </View>
        </CampoFormulario>

        {/* Plan */}
        <CampoFormulario etiqueta="Plan (opcional)">
          <TextInput
            value={plan}
            onChangeText={setPlan}
            placeholder="Ejemplo: Plan Premium"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

        {/* Monto */}
        <CampoFormulario etiqueta="Monto mensual">
          <TextInput
            value={formatearMiles(monto)}
            onChangeText={(t) => setMonto(soloDigitos(t))}
            keyboardType="numeric"
            placeholder="$10.500"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
          {montoNumerico > 0 && (
            <Text className="text-slate-400 text-xs font-inter-regular mt-1.5">
              Equivale a {formatearCLP(montoNumerico * 12)} al año
            </Text>
          )}
        </CampoFormulario>

        {/* Día de cobro: viene de la tarjeta, no se ingresa */}
        <View className="mb-8 flex-row items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center mr-3">
            <Ionicons name="calendar-outline" size={18} color="#1D4ED8" />
          </View>
          <Text className="flex-1 text-blue-900 text-xs font-inter-regular">
            {tarjetaSeleccionada
              ? `Se cobrará el día ${tarjetaSeleccionada.diaVencimiento} de cada mes, igual que el vencimiento de ${tarjetaSeleccionada.banco}.`
              : 'El día de cobro será el mismo del vencimiento de la tarjeta.'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleGuardar}
          className="w-full h-12 bg-color-action rounded-2xl items-center justify-center mb-8 shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-inter-bold">Guardar Suscripción</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal selección de tarjeta (muestra el cupo disponible de cada una) */}
      <ModalSeleccion
        visible={modalVisible}
        titulo="Seleccionar Tarjeta"
        onCerrar={() => setModalVisible(false)}
      >
        {tarjetas.map((t) => (
          <FilaOpcion
            key={t.id}
            seleccionada={tarjetaId === t.id}
            onPress={() => {
              setTarjetaId(t.id);
              setModalVisible(false);
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colorHex }} />
              <View>
                <Text className="text-slate-900 text-base font-inter-medium">{t.banco}</Text>
                <Text className="text-slate-500 text-xs">Disponible: {formatearCLP(t.cupoDisponible)}</Text>
              </View>
            </View>
          </FilaOpcion>
        ))}
      </ModalSeleccion>
    </PantallaFormulario>
  );
}
