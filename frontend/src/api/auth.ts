import { api } from './axios';

export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthLoginResponse = {
  token: string;
  username: string;
  role: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  role: 'ADMIN' | 'ATENDENTE' | 'FINANCEIRO';
};

export async function loginRequest(payload: AuthLoginRequest) {
  const response = await api.post<AuthLoginResponse>('/auth/login', payload);
  return response.data;
}

export async function registerRequest(payload: RegisterRequest) {
  await api.post('/auth/register', payload);
}
