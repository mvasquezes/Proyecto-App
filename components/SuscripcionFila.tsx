import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatearCLP } from '../constants/formato';
import { SuscripcionItem } from '../context/AppContext';

const PALETA = ['#E50914', '#1DB954', '#113CCF', '#7C3AED', '#EA580C', '#0891B2', '#DB2777', '#15803D'];

// Mismo nombre -> mismo color, siempre
export const colorSuscripcion = (nombre: string) => {
  let h = 0;
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) % PALETA.length;
  return PALETA[h];
};

interface Props {
  item: SuscripcionItem;
  mostrarCobro?: boolean;          // Vista de Suscripciones: muestra "Cobra 15 de Noviembre · En 5 días"
  ocultarTarjeta?: boolean;        // Detalle de tarjeta: ya se sabe cuál es, no se repite el banco
  onEliminar?: (s: SuscripcionItem) => void;
}

/** Línea de texto bajo el nombre; cambia según dónde se muestre la fila. */
function textoSecundario({ item, mostrarCobro, ocultarTarjeta }: Required<Pick<Props, 'item' | 'mostrarCobro' | 'ocultarTarjeta'>>) {
  const plan = item.plan || 'Mensual';

  if (mostrarCobro) {
    return item.pagadaEsteMes
      ? `Al día este mes · Cobra ${item.proximoCobro}`
      : `Cobra ${item.proximoCobro} · ${item.textoRestante}`;
  }
  if (ocultarTarjeta) return `${plan} · Cobra ${item.proximoCobro}`;
  return `${plan} · ${item.tarjetaBanco}`; // Home
}

export default function SuscripcionFila({
  item,
  mostrarCobro = false,
  ocultarTarjeta = false,
  onEliminar,
}: Props) {
  return (
    <View className="p-4 bg-white rounded-2xl border border-slate-100 flex-row items-center shadow-sm mb-3">
      {/* Avatar con inicial */}
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: colorSuscripcion(item.nombre) }}
      >
        <Text className="text-white text-base font-inter-bold">
          {item.nombre.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Nombre y texto secundario */}
      <View className="flex-1 pr-2">
        <Text className="text-slate-900 text-base font-inter-bold" numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text className="text-slate-400 text-xs font-inter-regular" numberOfLines={1}>
          {textoSecundario({ item, mostrarCobro, ocultarTarjeta })}
        </Text>
      </View>

      {/* Precio (y tarjeta asociada en la vista de Suscripciones) */}
      <View className="items-end">
        <Text className="text-slate-900 text-base font-inter-bold">{formatearCLP(item.monto)}</Text>
        {mostrarCobro && (
          <View className="flex-row items-center mt-0.5">
            <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.tarjetaColor }} />
            <Text className="text-slate-400 text-[10px] font-inter-regular" numberOfLines={1}>
              {item.tarjetaBanco}
            </Text>
          </View>
        )}
      </View>

      {onEliminar && (
        <TouchableOpacity onPress={() => onEliminar(item)} className="ml-3 p-1" activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={18} color="#94A3B8" />
        </TouchableOpacity>
      )}
    </View>
  );
}
