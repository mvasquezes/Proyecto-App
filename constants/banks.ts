export interface BankOption {
  id: string;
  nombre: string;
  colorHex: string;
}

export const LISTA_BANCOS: BankOption[] = [
  { id: 'bancoestado', nombre: 'Banco Estado', colorHex: '#EA580C' },
  { id: 'falabella', nombre: 'CMR Falabella', colorHex: '#15803D' },
  { id: 'santander', nombre: 'Banco Santander', colorHex: '#DC2626' },
  { id: 'mastercard', nombre: 'MasterCard', colorHex: '#1E293B' },
  { id: 'visa', nombre: 'Visa', colorHex: '#1E3A8A' },
];