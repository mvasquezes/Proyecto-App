import React from 'react';
import { Text, View } from 'react-native';
<<<<<<< HEAD
import { COLOR_TARJETA_DEFAULT } from '../constants/banks';
=======
// el tipo de la tarjeta que recibe
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import { TarjetaItem } from '../context/AppContext';

// recibe una tarjeta en item y la dibuja en grande (se usa en la vista previa y en el detalle)
export default function CardItem({ item }: { item: TarjetaItem }) {
  return (
<<<<<<< HEAD
=======
    // la tarjeta: ancho completo, 160px de alto, puntas redondeadas y el color del banco de fondo
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
    <View
      className="w-full h-40 p-6 rounded-3xl justify-between overflow-hidden shadow-lg mb-4"
      style={{ backgroundColor: item.colorHex || COLOR_TARJETA_DEFAULT }}
    >
      {/* circulo blanco transparente arriba a la izquierda, es el brillo que venia en Figma */}
      <View className="w-28 h-28 -left-8 -top-8 absolute bg-white/10 rounded-full" />

      {/* fila de arriba con el nombre del banco */}
      <View className="flex-row justify-between items-start">
        {/* si no viene banco muestra "Nombre Banco" */}
        <Text className="text-white text-base font-inter-bold tracking-wide">
          {item.banco || "Nombre Banco"}
        </Text>
      </View>

<<<<<<< HEAD
      {/* Monto y Vencimiento */}
=======

      {/* parte de abajo: monto del mes y vencimiento, con un poco de espacio entre lineas (gap-1) */}
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
      <View className="gap-1">
        <Text className="text-white/80 text-xs font-inter-medium">
          Total a Pagar:
        </Text>
        {/* monto ya formateado, ej: $40.000. Si viene vacio muestra $0 */}
        <Text className="text-white text-3xl font-inter-medium tracking-tight">
          {item.monto || "$0"}
        </Text>
        {/* texto del vencimiento, ej: Vence 15 de Octubre (Quedan 6 dias) */}
        <Text className="text-white/80 text-xs font-inter-regular pt-0.5">
          {item.vencimiento || "Fecha no definida"}
        </Text>
      </View>
    </View>
  );
}
