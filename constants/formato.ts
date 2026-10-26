/**
 * Deja solo los dígitos de un texto: "10.000" -> "10000".
 * Úsalo para guardar en el estado lo que escribe el usuario.
 */
export const soloDigitos = (txt: string): string => txt.replace(/[^0-9]/g, '');

/**
 * Agrega puntos de miles a un texto numérico: "300000" -> "300.000".
 * Úsalo en la prop `value` de un TextInput para que se vea con puntos al escribir.
 */
export const formatearMiles = (txt: string): string => {
  const digitos = soloDigitos(txt).replace(/^0+/, ''); // quita ceros a la izquierda
  return digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formato de dinero chileno para mostrar en pantalla: 10000 -> "$10.000".
 * Es el único lugar donde se formatean montos: si cambia el formato, se cambia aquí.
 */
export const formatearCLP = (n: number): string => `$${n.toLocaleString('es-CL')}`;
