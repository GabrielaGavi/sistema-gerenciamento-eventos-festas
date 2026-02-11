import { api } from './axios';

export type ClientResponse = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientRequest = {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
};

export async function listClients(termo?: string) {
  const response = await api.get<ClientResponse[]>('/clients', {
    params: termo ? { termo } : undefined
  });
  return response.data;
}

export async function createClient(payload: ClientRequest) {
  const response = await api.post<ClientResponse>('/clients', payload);
  return response.data;
}

export async function updateClient(id: number, payload: ClientRequest) {
  const response = await api.put<ClientResponse>(`/clients/${id}`, payload);
  return response.data;
}

export async function deleteClient(id: number) {
  await api.delete(`/clients/${id}`);
}
