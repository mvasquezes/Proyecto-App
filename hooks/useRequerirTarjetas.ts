import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { confirmar } from '../constants/alertas';
import { RUTAS } from '../constants/rutas';
import { useApp } from '../context/AppContext';

/**
 * Regla de negocio: transacciones y suscripciones necesitan una tarjeta.
 * Si no hay ninguna registrada, ofrece crearla; si el usuario cancela, vuelve
 * a `rutaSiCancela`. Úsalo al inicio de las pantallas de registro.
 */
export function useRequerirTarjetas(accion: 'transacción' | 'suscripción', rutaSiCancela: string) {
  const router = useRouter();
  const { tarjetas } = useApp();

  useEffect(() => {
    if (tarjetas.length > 0) return;

    confirmar({
      titulo: 'Sin tarjetas',
      mensaje: `Debes registrar al menos una tarjeta antes de agregar una ${accion}.\n\n¿Deseas crear una tarjeta ahora?`,
      textoConfirmar: 'Crear Tarjeta',
      onConfirmar: () => router.replace(RUTAS.registrarTarjeta),
      onCancelar: () => router.replace(rutaSiCancela as any),
    });
  }, [tarjetas.length]);
}
