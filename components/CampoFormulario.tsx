import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * Clases de un TextInput de formulario.
 * `conError` pinta el borde rojo (ej: alias obligatorio vacío).
 */
export const estiloInput = (conError: boolean = false) =>
  `w-full h-12 px-4 bg-slate-50 border ${
    conError ? 'border-red-300' : 'border-slate-300'
  } rounded-xl text-slate-800 font-inter-medium`;

interface CampoProps {
  etiqueta: string;
  children: ReactNode;
  className?: string; // Para cambiar el margen inferior (ej: último campo)
}

/** Etiqueta + control, con el espaciado estándar de los formularios. */
export function CampoFormulario({ etiqueta, children, className = 'mb-5' }: CampoProps) {
  return (
    <View className={className}>
      <Text className="text-black text-base font-inter-bold mb-1.5">{etiqueta}</Text>
      {children}
    </View>
  );
}

interface SelectorProps {
  onPress: () => void;
  children: ReactNode;
}

/** Campo desplegable: se ve como un input pero abre un selector (modal) al tocarlo. */
export function SelectorCampo({ onPress, children }: SelectorProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
    >
      <View className="flex-row items-center flex-1">{children}</View>
      <Ionicons name="chevron-down" size={18} color="#64748B" />
    </TouchableOpacity>
  );
}
