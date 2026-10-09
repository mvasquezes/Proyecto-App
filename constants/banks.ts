// forma que tiene cada banco de la lista
export interface BankOption {
  id: string;       // identificador interno, no se muestra
  nombre: string;   // nombre que sale en el selector y en la tarjeta
  colorHex: string; // color de fondo de la tarjeta
}

// lista de bancos que aparecen en el selector, el primero es el que sale elegido por defecto
// para agregar uno nuevo basta con sumar una linea (si es una tarjeta generica tipo Amex, tambien hay que sumarla a requiereAlias en RegistrarTarjeta.tsx)
export const LISTA_BANCOS: BankOption[] = [
  { id: 'bancoestado', nombre: 'Banco Estado', colorHex: '#EA580C' },   // naranjo
  { id: 'falabella', nombre: 'CMR Falabella', colorHex: '#15803D' },    // verde
  { id: 'santander', nombre: 'Banco Santander', colorHex: '#DC2626' },  // rojo
  { id: 'mastercard', nombre: 'MasterCard', colorHex: '#1E293B' },      // gris oscuro, pide alias
  { id: 'visa', nombre: 'Visa', colorHex: '#1E3A8A' },                  // azul, pide alias
];
