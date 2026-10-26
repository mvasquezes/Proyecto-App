import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ModalProps {
  visible: boolean;
  titulo: string;
  onCerrar: () => void;
  alturaMax?: 'max-h-[70%]' | 'max-h-[80%]'; // Clases literales para que NativeWind las detecte
  encabezadoExtra?: ReactNode;               // Ej: buscador sobre la lista
  children: ReactNode;                       // Las opciones (FilaOpcion)
}

/** Bottom sheet reutilizable para elegir una opción de una lista. */
export default function ModalSeleccion({
  visible,
  titulo,
  onCerrar,
  alturaMax = 'max-h-[70%]',
  encabezadoExtra,
  children,
}: ModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className={`bg-slate-50 rounded-t-3xl p-6 ${alturaMax}`}>
          <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
            <Text className="text-slate-800 text-lg font-inter-bold">{titulo}</Text>
            <TouchableOpacity onPress={onCerrar}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {encabezadoExtra}

          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface FilaProps {
  seleccionada: boolean;
  onPress: () => void;
  children: ReactNode;
}

/** Una opción de la lista: contenido a la izquierda, check (si está elegida) o flecha a la derecha. */
export function FilaOpcion({ seleccionada, onPress, children }: FilaProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
    >
      {children}
      {seleccionada ? (
        <Ionicons name="checkmark-circle" size={22} color="#10B981" />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );
}
