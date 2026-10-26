// forma que tiene cada banco de la lista
export interface BankOption {
  id: string;       // identificador interno, no se muestra
  nombre: string;   // nombre que sale en el selector y en la tarjeta
  colorHex: string; // color de fondo de la tarjeta
}

// Color de respaldo cuando una tarjeta no trae color propio
export const COLOR_TARJETA_DEFAULT = '#1E293B';

export const LISTA_BANCOS: BankOption[] = [
  { id: 'bancoestado', nombre: 'Banco Estado', colorHex: '#EA580C' },
  { id: 'falabella', nombre: 'CMR Falabella', colorHex: '#15803D' },
  { id: 'santander', nombre: 'Banco Santander', colorHex: '#DC2626' },
  { id: 'mastercard', nombre: 'MasterCard', colorHex: '#1E293B' },
  { id: 'visa', nombre: 'Visa', colorHex: '#1E3A8A' },
];
