// iconos de Ionicons
import { Ionicons } from '@expo/vector-icons';
// para navegar entre pantallas
import { useRouter } from 'expo-router';
// useState para guardar lo que se escribe en el formulario
import React, { useState } from 'react';
// Alert para los avisos, Modal para la ventana de elegir banco, TextInput para los campos
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
// margenes seguros del celular
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// la tarjeta grande que usamos como vista previa
import CardItem from '../components/TarjetaGrande';
// la lista de bancos y su tipo
import { BankOption, LISTA_BANCOS } from '../constants/banks';
// el tipo de tarjeta y el hook para guardar en el contexto
import { TarjetaItem, useApp } from '../context/AppContext';

export default function NuevaTarjetaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // sacamos la funcion que agrega tarjetas al contexto
  const { agregarTarjeta } = useApp();

  // banco elegido, parte con el primero de la lista (Banco Estado)
  const [bancoSeleccionado, setBancoSeleccionado] = useState<BankOption>(LISTA_BANCOS[0]);
  // lo que se escribe en el campo alias
  const[alias, setAlias] = useState('');
  // el cupo como texto, tal como viene del input
  const[cupo, setCupo] = useState('');
  // el dia de vencimiento como texto
  const [dia, setDia] = useState('');
  // si el modal de bancos esta abierto o cerrado
  const [modalVisible, setModalVisible] = useState(false);
  // lo que se escribe en el buscador del modal
  const [busqueda, setBusqueda] = useState('');

// true si el banco es visa o mastercard, porque con esas solas no se sabe de que banco es y hay que poner alias
  const requiereAlias = bancoSeleccionado.id === 'visa' || bancoSeleccionado.id === 'mastercard';

// el titulo de la tarjeta: si pide alias y ya escribieron uno se usa el alias, si no el nombre del banco
  const tituloTarjeta = requiereAlias && alias.trim() !== ''
    ? alias.trim()
    : bancoSeleccionado.nombre;


// le saca todo lo que no sea numero al cupo y lo pasa a numero, si queda vacio vale 0
const cupoNumerico = parseInt(cupo.replace(/[^0-9]/g, ''), 10) || 0;

  // tarjeta de mentira solo para la vista previa, se arma con lo que se va escribiendo y no se guarda
const previewItem: TarjetaItem = {
    id: 'preview',
    banco: tituloTarjeta,
    nombre: tituloTarjeta,
    // si no hay alias muestra "Sin alias"
    alias: alias || 'Sin alias',
    // monto en 0 porque una tarjeta nueva no tiene compras
    monto: '$0',
    montoNumerico: 0,
    // si el dia esta vacio usa 1 para que no quede NaN
    diaVencimiento: parseInt(dia, 10) || 1,
    estadoVencimiento: '',
    // si ya escribieron el dia lo muestra, si no sale "Fecha de corte"
    vencimiento: dia ? `${dia} de este mes` : 'Fecha de corte',
    // el color sale del banco elegido
    colorHex: bancoSeleccionado.colorHex,
    cupoTotal: cupoNumerico,
    cupoDisponible: cupoNumerico,
  };

// se ejecuta al tocar "Guardar Tarjeta"
const handleGuardar = () => {
    // si es visa o mastercard y el alias esta vacio, avisa y corta aca
    // ojo: en web Alert.alert no muestra nada, asi que ahi no se ve el aviso (pero igual no guarda)
    if (requiereAlias && !alias.trim()) {
      Alert.alert(
        'Alias obligatorio',
        `Por favor ingresa un nombre para identificar tu tarjeta ${bancoSeleccionado.nombre} (Ej: Visa Platinum).`
      );
      return;
    }

    // pasa el dia a numero
    const diaNumero = parseInt(dia, 10);
    // si esta vacio, no es numero o se sale de 1 a 31, avisa y corta
    if (!dia.trim() || isNaN(diaNumero) || diaNumero < 1 || diaNumero > 31) {
      Alert.alert('Día inválido', 'Por favor ingresa un día de facturación válido entre 1 y 31.');
      return;
    }

    // el cupo tiene que ser mayor a 0
    if (cupoNumerico <= 0) {
      Alert.alert('Cupo inválido', 'Por favor ingresa un cupo total mayor a 0.');
      return;
    }

    // si no escribieron alias (solo pasa con los bancos normales) se usa el nombre del banco
    const aliasFinal = alias.trim() !== '' ? alias.trim() : bancoSeleccionado.nombre;

    // guarda la tarjeta en el contexto, el resto de datos (monto del mes, cupo disponible) se calculan solos
    agregarTarjeta({
      // usa la hora actual en milisegundos como id, asi no se repite
      id: Date.now().toString(),
      banco: tituloTarjeta,
      nombre: tituloTarjeta,
      alias: aliasFinal,
      diaVencimiento: diaNumero,
      colorHex: bancoSeleccionado.colorHex,
      cupoTotal: cupoNumerico,
    });

    // se va a la lista de tarjetas, con replace para que al volver atras no aparezca el formulario
    router.replace('/Tarjetas');
  };

  // filtra los bancos segun lo que se escriba en el buscador, pasando todo a minuscula para comparar
  const bancosFiltrados = LISTA_BANCOS.filter(b =>
    b.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    // fondo oscuro de toda la pantalla, con padding arriba y abajo para el notch y la barra de gestos
    <View
      className="flex-1 bg-color-menu"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}
    >
      {/* caja blanca donde va todo el formulario */}
      <View className="flex-1 bg-white">
        {/* encabezado con flecha para volver al inicio y el titulo */}
        <View className="px-6 pt-4 pb-2 flex-row items-center justify-between border-b border-slate-100">
          <TouchableOpacity onPress={() => router.replace('/')} className="w-8">
            <Ionicons name="chevron-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-slate-600 text-base font-inter-bold">
            Formulario Nueva Tarjeta
          </Text>
          {/* caja vacia del mismo ancho que la flecha para que el titulo quede al centro */}
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* vista previa: la tarjeta grande con los datos que se van escribiendo */}
          <View className="pt-4 pb-4">
            <CardItem item={previewItem} />
          </View>

          {/* selector de banco: es un boton que abre el modal de mas abajo */}
          <View className="mb-4">
            <Text className="text-black text-base font-inter-bold mb-1">Emisor / Banco</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl flex-row items-center justify-between"
            >
              {/* muestra el nombre del banco elegido */}
              <Text className="text-slate-900 text-sm font-inter-medium">
                {bancoSeleccionado.nombre}
              </Text>
              {/* flechita hacia abajo */}
              <Ionicons name="chevron-down" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* campo alias */}
          <View className="mb-4">
            {/* el texto cambia a Obligatorio u Opcional segun el banco */}
            <Text className="text-black text-base font-inter-bold mb-1">
              Alias de la Tarjeta {requiereAlias ? '(Obligatorio)' : '(Opcional)'}
            </Text>
            <TextInput
              value={alias}
              onChangeText={setAlias}
              // el ejemplo cambia segun si el alias es obligatorio o no
              placeholder={
                requiereAlias
                  ? `Ej: ${bancoSeleccionado.nombre} Platinum`
                  : 'Ej: Tarjeta del trabajo (opcional)'
              }
              placeholderTextColor="#94A3B8"
              // si el alias es obligatorio y esta vacio el borde se pone rojo
              className={`w-full h-12 px-4 bg-slate-50 border rounded-xl text-slate-800 font-inter-medium ${
                requiereAlias && !alias.trim() ? 'border-red-300' : 'border-slate-300'
              }`}
            />
          </View>


        {/* campo cupo total */}
                  <View className="mb-5">
                    <Text className="text-black text-base font-inter-bold mb-1.5">Cupo Total</Text>
                    <TextInput
                      value={cupo}
                      // cada vez que escriben borra lo que no sea numero (puntos, $, letras)
                      onChangeText={(txt) => setCupo(txt.replace(/[^0-9]/g, ''))}
                      // abre el teclado numerico
                      keyboardType="numeric"
                      placeholder="$300.000"
                      placeholderTextColor="#94A3B8"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-inter-medium"
                    />
                  </View>

        {/* campo dia de vencimiento */}
        <View className="mb-8">
          <Text className="text-black text-base font-inter-bold mb-1">
            Día de Facturación / Vencimiento
          </Text>
          <TextInput
            value={dia}
            onChangeText={(texto) => {
              // borra todo lo que no sea numero
              const soloNumeros = texto.replace(/[^0-9]/g, '');

              // si borraron todo, deja el campo vacio
              if (soloNumeros === '') {
                setDia('');
                return;
              }

              // solo acepta el cambio si el numero es 31 o menos
              const num = parseInt(soloNumeros, 10);
              if (num <= 31) {
                setDia(soloNumeros);
              }
            }}
            keyboardType="numeric"
            // maximo 2 digitos
            maxLength={2}
            placeholder="Seleccionar día (1 - 31)"
            placeholderTextColor="#94A3B8"
            className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
          />
        </View>

          {/* boton guardar, llama a handleGuardar */}
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

        {/* ventana para elegir banco, sale desde abajo y deja ver la pantalla detras (transparent) */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          {/* fondo negro semitransparente, empuja el contenido hacia abajo */}
          <View className="flex-1 bg-black/50 justify-end">
            {/* la caja del modal, maximo 80% del alto */}
            <View className="bg-slate-50 rounded-t-3xl max-h-[80%] p-6">
              {/* titulo del modal y la X para cerrarlo */}
              <View className="flex-row items-center justify-between pb-4 border-b border-slate-200">
                <Text className="text-slate-800 text-lg font-inter-bold">Seleccionar Banco</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#0F172A" />
                </TouchableOpacity>
              </View>

              {/* buscador con lupa */}
              <View className="my-4 h-12 px-4 bg-white rounded-2xl border border-slate-200 flex-row items-center">
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput
                  value={busqueda}
                  onChangeText={setBusqueda}
                  placeholder="Buscar banco o emisor..."
                  placeholderTextColor="#94A3B8"
                  className="flex-1 text-slate-800 ml-2"
                />
              </View>

              {/* lista de bancos que coinciden con la busqueda */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {bancosFiltrados.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      // guarda el banco elegido
                      setBancoSeleccionado(item);
                      // limpia el alias para que no quede el que se escribio con el banco anterior
                      setAlias('');
                      // cierra el modal
                      setModalVisible(false);
                    }}
                    className="h-16 px-4 mb-2 bg-white rounded-2xl border border-slate-100 flex-row items-center justify-between shadow-sm"
                  >
                    <Text className="text-slate-900 text-base font-inter-medium">
                      {item.nombre}
                    </Text>
                    {/* check verde en el banco que esta elegido, flechita en los demas */}
                    {bancoSeleccionado.id === item.id ? (
                      <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
