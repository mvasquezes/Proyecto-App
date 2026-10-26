import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EncabezadoPantalla from './EncabezadoPantalla';

interface Props {
  titulo: string;
  onVolver: () => void;
  children: ReactNode;
}

/**
 * Marco común de las pantallas de formulario y detalle:
 * fondo oscuro en los bordes seguros (notch / barra inferior), hoja blanca y encabezado.
 */
export default function PantallaFormulario({ titulo, onVolver, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-color-menu"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 bg-white">
        <EncabezadoPantalla titulo={titulo} onVolver={onVolver} variante="formulario" />
        {children}
      </View>
    </View>
  );
}
