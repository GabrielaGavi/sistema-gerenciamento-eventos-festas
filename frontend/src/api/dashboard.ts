import { api } from './axios';

export type DashboardEvent = {
  id: number;
};

export async function listContractsPending() {
  const response = await api.get<DashboardEvent[]>('/dashboard/contracts-pending');
  return response.data;
}

export async function listPartiesAgenda() {
  const response = await api.get<DashboardEvent[]>('/dashboard/parties-agenda');
  return response.data;
}

export async function listVisitsAgenda() {
  const response = await api.get<DashboardEvent[]>('/dashboard/visits-agenda');
  return response.data;
}
