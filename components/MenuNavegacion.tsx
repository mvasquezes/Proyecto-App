// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// usePathname da la ruta actual, useRouter sirve para navegar
import { usePathname, useRouter } from 'expo-router';
<<<<<<< HEAD
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
=======
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// para saber cuanto mide la barra de gestos del celular
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RUTAS } from '../constants/rutas';

type NombreIcono = React.ComponentProps<typeof Ionicons>['name'];

/* ============================================================
   Menú de acciones del botón "+"
   ============================================================ */

// Opciones que se muestran al tocar el botón "+" (la primera va destacada)
const ACCIONES: {
  ruta: string;
  icono: NombreIcono;
  titulo: string;
  detalle: string;
  destacada: boolean;
}[] = [
  {
    ruta: RUTAS.registrarTransaccion,
    icono: 'receipt-outline',
    titulo: 'Nueva transacción',
    detalle: 'Registra una compra o cargo en cuotas',
    destacada: true,
  },
  {
    ruta: RUTAS.registrarSuscripcion,
    icono: 'repeat-outline',
    titulo: 'Nueva suscripción',
    detalle: 'Netflix, Spotify y otros cobros mensuales',
    destacada: false,
  },
  {
    ruta: RUTAS.registrarTarjeta,
    icono: 'card-outline',
    titulo: 'Nueva tarjeta',
    detalle: 'Agrega una tarjeta de crédito',
    destacada: false,
  },
];

interface MenuAccionesProps {
  visible: boolean;
  onCerrar: () => void;
  onElegir: (ruta: string) => void;
}

/** Bottom sheet con las acciones de registro. */
function MenuAcciones({ visible, onCerrar, onElegir }: MenuAccionesProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCerrar}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onCerrar}>
        {/* Pressable interno evita que tocar el sheet lo cierre */}
        <Pressable
          className="bg-slate-50 rounded-t-3xl px-6 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          onPress={() => {}}
        >
          {/* Barra de arrastre decorativa */}
          <View className="self-center w-10 h-1 rounded-full bg-slate-300 mb-4" />

          <View className="flex-row items-center justify-between pb-4">
            <Text className="text-slate-800 text-lg font-inter-bold">¿Qué quieres registrar?</Text>
            <TouchableOpacity onPress={onCerrar}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {ACCIONES.map((a) => (
            <TouchableOpacity
              key={a.ruta}
              onPress={() => onElegir(a.ruta)}
              activeOpacity={0.85}
              className={`p-4 mb-3 rounded-2xl flex-row items-center border shadow-sm ${
                a.destacada ? 'bg-color-action border-color-action' : 'bg-white border-slate-100'
              }`}
            >
              <View
                className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
                  a.destacada ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                <Ionicons name={a.icono} size={22} color={a.destacada ? '#FFFFFF' : '#1E293B'} />
              </View>
              <View className="flex-1">
                <Text className={`text-base font-inter-bold ${a.destacada ? 'text-white' : 'text-slate-900'}`}>
                  {a.titulo}
                </Text>
                <Text className={`text-xs font-inter-regular ${a.destacada ? 'text-white/80' : 'text-slate-400'}`}>
                  {a.detalle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={a.destacada ? '#FFFFFF' : '#CBD5E1'} />
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ============================================================
   Barra de navegación inferior
   ============================================================ */

interface ItemNavProps {
  icono: NombreIcono;
  iconoActivo?: NombreIcono; // Variante rellena cuando el ítem está activo (ej: home)
  etiqueta: string;
  activo?: boolean;
  onPress?: () => void;     // Sin onPress = sección aún no disponible (Proyecciones)
}

/** Un botón de la barra: ícono + etiqueta, blanco si es la pantalla actual. */
function ItemNav({ icono, iconoActivo, etiqueta, activo = false, onPress }: ItemNavProps) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center justify-center flex-1 py-1">
      <Ionicons
        name={activo && iconoActivo ? iconoActivo : icono}
        size={22}
        color={activo ? '#FFFFFF' : '#94A3B8'}
      />
      <Text className={`${activo ? 'text-white' : 'text-color-inactive'} text-[10px] font-inter-regular mt-1`}>
        {etiqueta}
      </Text>
    </TouchableOpacity>
  );
}

export default function BottomNavigation() {
  const router = useRouter();
  // ruta en la que estamos, ej: "/" o "/Tarjetas"
  // ojo: no se esta usando todavia (el lint lo avisa), la idea seria usarla para pintar de blanco el boton de la pantalla en que estas
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // El ítem activo se pinta de blanco según la ruta actual
  const activo = (ruta: string) => pathname.toLowerCase() === ruta.toLowerCase();

  const irA = (ruta: string) => {
    setMenuAbierto(false);
    router.push(ruta as any);
  };

  return (
<<<<<<< HEAD
    <>
      <View
        className="w-full bg-color-menu rounded-t-3xl flex-row justify-around items-center px-2 pt-2"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <ItemNav
          icono="home-outline"
          iconoActivo="home"
          etiqueta="Inicio"
          activo={activo(RUTAS.inicio)}
          onPress={() => router.replace(RUTAS.inicio)}
        />
        <ItemNav
          icono="repeat-outline"
          etiqueta="Suscripciones"
          activo={activo(RUTAS.suscripciones)}
          onPress={() => router.replace(RUTAS.suscripciones)}
        />

        {/* Botón flotante central (+): abre el menú de acciones */}
        <View className="items-center justify-center flex-1">
          <TouchableOpacity
            onPress={() => setMenuAbierto(true)}
            className="w-14 h-14 -mt-8 bg-color-action rounded-full items-center justify-center border-4 border-bg-color shadow-lg"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ItemNav
          icono="card-outline"
          etiqueta="Tarjetas"
          activo={activo(RUTAS.tarjetas)}
          onPress={() => router.replace(RUTAS.tarjetas)}
        />
        <ItemNav icono="trending-up-outline" etiqueta="Proyecciones" />
      </View>

      <MenuAcciones visible={menuAbierto} onCerrar={() => setMenuAbierto(false)} onElegir={irA} />
    </>
=======
    // barra oscura con las puntas de arriba redondeadas y los 5 botones en fila
    // el paddingBottom usa lo que mide la barra de gestos, o 12 si es menos
    <View
      className="w-full bg-color-menu rounded-t-3xl flex-row justify-around items-center px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
    >
      {/* boton Inicio, siempre se ve blanco (activo) aunque estes en otra pantalla */}
      <TouchableOpacity onPress={() => router.replace('/')} className="items-center justify-center flex-1 py-1">
        <Ionicons name="home" size={22} color="#FFFFFF" />
        <Text className="text-white text-[10px] font-inter-regular mt-1">
          Inicio
        </Text>
      </TouchableOpacity>

      {/* boton Suscripciones, en gris y sin onPress porque esa pantalla no existe todavia */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="repeat-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
        Suscripciones
        </Text>
      </TouchableOpacity>

      {/* caja del boton del medio */}
      <View className="items-center justify-center flex-1">
        {/* boton verde redondo con el +, abre el formulario de tarjeta nueva */}
        {/* el -mt-8 lo sube para que sobresalga por encima de la barra */}
        <TouchableOpacity
        onPress={() => router.push('/RegistrarTarjeta')}
        className="w-14 h-14 -mt-8 bg-color-action rounded-full items-center justify-center border-4 border-bg-color shadow-lg"
        activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* boton Tarjetas, abre la lista de tarjetas */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1" onPress={() => router.push('/Tarjetas')}>
        <Ionicons name="card-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
          Tarjetas
        </Text>
      </TouchableOpacity>

      {/* boton Proyecciones, igual que Suscripciones: todavia sin pantalla */}
      <TouchableOpacity className="items-center justify-center flex-1 py-1">
        <Ionicons name="trending-up-outline" size={22} color="#94A3B8" />
        <Text className="text-color-inactive text-[10px] font-inter-regular mt-1">
          Proyecciones
        </Text>
      </TouchableOpacity>
    </View>
>>>>>>> 4982294610bdcc0236d5418b9c38399710b58961
  );
}
