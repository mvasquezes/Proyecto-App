import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  titulo: string;
  onVolver: () => void;
  // 'pagina': pantallas de listado (Tarjetas, Suscripciones) | 'formulario': formularios y detalle
  variante?: 'pagina' | 'formulario';
}

/** Encabezado con botón de retorno y título centrado. */
export default function EncabezadoPantalla({ titulo, onVolver, variante = 'pagina' }: Props) {
  const esPagina = variante === 'pagina';

  return (
    <View
      className={
        esPagina
          ? 'px-6 pt-6 pb-4 flex-row items-center justify-between'
          : 'px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-100'
      }
    >
      <TouchableOpacity onPress={onVolver} className="w-8">
        <Ionicons name="chevron-back" size={24} color={esPagina ? '#1E293B' : '#0F172A'} />
      </TouchableOpacity>
      <Text className={esPagina ? 'text-slate-800 text-lg font-inter-bold' : 'text-slate-600 text-base font-inter-bold'}>
        {titulo}
      </Text>
      {/* Espaciador para que el título quede centrado */}
      <View className="w-8" />
    </View>
  );
}
