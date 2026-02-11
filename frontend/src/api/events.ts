import { api } from './axios';
import { ClientRequest, ClientResponse } from './clients';

export type EventType = 'VISITA' | 'FESTA';
export type EventStatus = 'SOLICITADO' | 'AGENDADO' | 'PRE_RESERVA' | 'CONFIRMADO' | 'REALIZADO' | 'CANCELADO';
export type EventCategory = 'INFANTIL' | 'CASAMENTO' | 'CORPORATIVO' | 'ANIVERSARIO' | 'FORMATURA' | 'OUTRO';
export type PaymentMethod = 'PIX' | 'CARTAO' | 'DINHEIRO' | 'TRANSFERENCIA';

export type EventResponse = {
  id: number;
  tipoEvento: EventType;
  dataHoraEvento?: string;
  dataHoraVisita?: string;
  capacidade?: number;
  categoria?: EventCategory;
  statusEvento: EventStatus;
  valorTotal?: string | number;
  valorPago?: string | number;
  preReservaValidadeDias?: number;
  contratoGerado: boolean;
  dadosContrato?: string;
  client: ClientResponse;
  createdAt?: string;
  updatedAt?: string;
};

export type ListEventsParams = {
  tipo?: EventType;
  status?: EventStatus;
  dataFrom?: string;
  dataTo?: string;
};

export type EventVisitRequest = {
  clientId?: number;
  client?: ClientRequest;
  dataHoraVisita: string;
  dataHoraEventoPretendida?: string;
  categoria?: EventCategory;
  capacidade?: number;
};

export type EventPartyRequest = {
  clientId: number;
  dataHoraEvento: string;
  capacidade?: number;
  categoria?: EventCategory;
  valorTotal: number;
  valorEntrada?: number;
  preReservaValidadeDias?: number;
  dadosContrato?: string;
};

export type ConvertVisitToPartyRequest = {
  dataHoraEvento: string;
  capacidade?: number;
  categoria?: EventCategory;
  valorTotal: number;
  valorEntrada?: number;
  preReservaValidadeDias?: number;
  dadosContrato?: string;
};

export type CancelEventRequest = {
  valorReembolso: number;
  formaPagamento: PaymentMethod;
  data?: string;
  observacao?: string;
};

export async function listEvents(params?: ListEventsParams) {
  const response = await api.get<EventResponse[]>('/events', { params });
  return response.data;
}

export async function createVisit(payload: EventVisitRequest) {
  const response = await api.post<EventResponse>('/events/visits', payload);
  return response.data;
}

export async function createParty(payload: EventPartyRequest) {
  const response = await api.post<EventResponse>('/events/parties', payload);
  return response.data;
}

export async function convertVisitToParty(id: number, payload: ConvertVisitToPartyRequest) {
  const response = await api.put<EventResponse>(`/events/${id}/convert-to-party`, payload);
  return response.data;
}

export async function cancelEvent(id: number, payload: CancelEventRequest) {
  const response = await api.put<EventResponse>(`/events/${id}/cancel`, payload);
  return response.data;
}
