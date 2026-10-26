import { Alert, Platform } from 'react-native';

/**
 * Diálogos que funcionan igual en web y móvil.
 *
 * Por qué existen: en web `Alert.alert` con botones NO hace nada, hay que usar
 * window.alert / window.confirm. Estas funciones esconden esa diferencia para
 * que las pantallas no repitan el `if (Platform.OS === 'web')`.
 */

const esWeb = Platform.OS === 'web';

/**
 * Mensaje informativo con un solo botón "OK".
 * `onAceptar` se ejecuta cuando el usuario cierra el mensaje (útil para navegar después).
 */
export function avisar(titulo: string, mensaje: string, onAceptar?: () => void) {
  if (esWeb) {
    window.alert(`${titulo}\n\n${mensaje}`);
    onAceptar?.();
    return;
  }
  Alert.alert(titulo, mensaje, onAceptar ? [{ text: 'OK', onPress: onAceptar }] : undefined);
}

interface OpcionesConfirmar {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  destructivo?: boolean;      // Pinta el botón de rojo en iOS (ej: eliminar)
  onConfirmar: () => void;
  onCancelar?: () => void;
}

/** Pregunta con dos botones (cancelar / confirmar). */
export function confirmar({
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  destructivo = false,
  onConfirmar,
  onCancelar,
}: OpcionesConfirmar) {
  if (esWeb) {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) onConfirmar();
    else onCancelar?.();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: textoCancelar, style: 'cancel', onPress: onCancelar },
    { text: textoConfirmar, style: destructivo ? 'destructive' : 'default', onPress: onConfirmar },
  ]);
}
