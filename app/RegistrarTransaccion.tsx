import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { CampoFormulario, estiloInput, SelectorCampo } from '../components/CampoFormulario';
import ModalSeleccion, { FilaOpcion } from '../components/ModalSeleccion';
import PantallaFormulario from '../components/PantallaFormulario';
import { avisar } from '../constants/alertas';
import { formatearCLP, formatearMiles, soloDigitos } from '../constants/formato';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';
import { useRequerirTarjetas } from '../hooks/useRequerirTarjetas';

export default function NuevaTransaccionScreen() {
  const router = useRouter();
  const { tarjetas, registrarTransaccion } = useApp();

  // Sin tarjetas no se puede registrar una transacción: ofrece crear una
  useRequerirTarjetas('transacción', RUTAS.inicio);

  // Se guarda solo el id y la tarjeta se busca en cada render:
  // así siempre tiene el cupo actualizado (una copia guardada quedaría desfasada).
  const [tarjetaId, setTarjetaId] = useState<string>(tarjetas[0]?.id ?? '');
  const tarjetaSeleccionada = tarjetas.find((t) => t.id === tarjetaId) ?? null;

  const [motivo, setMotivo] = useState('');
  const [monto, setMonto] = useState('');   // Solo dígitos; se muestra con puntos de miles
  const [cuotas, setCuotas] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);

  const handleGuardar = () => {
    if (!tarjetaSeleccionada) {
      avisar('Error', 'Selecciona una tarjeta para asignar la facturación.');
      return;
    }

    if (!motivo.trim()) {
      avisar('Campo requerido', 'Por favor ingresa un motivo para la compra.');
      return;
    }

    const montoLimpio = parseInt(monto, 10);
    if (isNaN(montoLimpio) || montoLimpio <= 0) {
      avisar('Monto inválido', 'Por favor ingresa un monto mayor a cero.');
      return;
    }

    const numCuotas = parseInt(cuotas, 10) || 1;

    const ok = registrarTransaccion(
      tarjetaSeleccionada.id,
      motivo.trim(),
      montoLimpio,
      numCuotas
    );

    // Si el contexto la rechazó, el monto supera el cupo: no mostramos "éxito"
    if (!ok) {
      avisar(
        'Cupo insuficiente',
        `El monto (${formatearCLP(montoLimpio)}) supera el cupo disponible de ${tarjetaSeleccionada.banco} (${formatearCLP(tarjetaSeleccionada.cupoDisponible)}).`
      );
      return; // No navegamos: el usuario puede corregir el monto
    }

    avisar('Éxito', 'Agregado correctamente', () => router.replace(RUTAS.inicio));
  };

  return (
    <PantallaFormulario titulo="Transacciones" onVolver={() => router.replace(RUTAS.inicio)}>
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* 1. Tarjeta */}
        <CampoFormulario etiqueta="Ingrese tarjeta">
          <SelectorCampo onPress={() => setModalVisible(true)}>
            <Text className="text-slate-900 text-sm font-inter-medium">
              {tarjetaSeleccionada
                ? `${tarjetaSeleccionada.banco} - ${tarjetaSeleccionada.nombre}`
                : 'Selecciona una tarjeta'}
            </Text>
          </SelectorCampo>
        </CampoFormulario>

        {/* 2. Motivo */}
        <CampoFormulario etiqueta="Ingrese motivo">
          <TextInput
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Ejemplo: Compra ropa Ripley"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

        {/* 3. Monto */}
        <CampoFormulario etiqueta="Ingrese monto">
          <TextInput
            value={formatearMiles(monto)}
            onChangeText={(txt) => setMonto(soloDigitos(txt))}
            keyboardType="numeric"
            placeholder="$30.000"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

        {/* 4. Cantidad de cuotas */}
        <CampoFormulario etiqueta="Ingrese cantidad cuotas" className="mb-8">
          <TextInput
            value={cuotas}
            onChangeText={(txt) => setCuotas(soloDigitos(txt))}
            keyboardType="numeric"
            placeholder="Ingresar cantidad de cuotas (ej. 1)"
            placeholderTextColor="#94A3B8"
            className={estiloInput()}
          />
        </CampoFormulario>

        {/* Botón Agregar */}
        <TouchableOpacity
          onPress={handleGuardar}
          className="w-full h-12 bg-color-action rounded-2xl items-center justify-center mb-8 shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-inter-bold">
            Agregar Transacción
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Selección de Tarjetas Registradas */}
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
                <Text className="text-slate-500 text-xs">Actual: {t.monto}</Text>
              </View>
            </View>
          </FilaOpcion>
        ))}
      </ModalSeleccion>
    </PantallaFormulario>
  );
}
