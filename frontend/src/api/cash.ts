import { api } from './axios';

export type CashEntry = {
  id: number;
  data: string;
  formaPagamento: 'PIX' | 'CARTAO' | 'DINHEIRO' | 'TRANSFERENCIA';
  operacao: 'ENTRADA' | 'SAIDA';
  tipo: 'DESPESA' | 'REEMBOLSO' | 'EVENTO';
  valor: string | number;
  observacao?: string;
};

export type CashSummary = {
  entrada: string | number;
  saida: string | number;
  total: string | number;
  disponivel: string | number;
};

export type CashEntryRequest = {
  formaPagamento: CashEntry['formaPagamento'];
  valor: number;
  data?: string;
  observacao?: string;
};

export type CashPaymentRequest = CashEntryRequest & {
  eventId: number;
};

export async function listCash() {
  const response = await api.get<CashEntry[]>('/cash');
  return response.data;
}

export async function getCashSummary() {
  const response = await api.get<CashSummary>('/cash/summary');
  return response.data;
}

export async function createEntry(payload: CashPaymentRequest) {
  const response = await api.post<CashEntry>('/cash/entry', payload);
  return response.data;
}

export async function createExpense(payload: CashEntryRequest) {
  const response = await api.post<CashEntry>('/cash/expense', payload);
  return response.data;
}
