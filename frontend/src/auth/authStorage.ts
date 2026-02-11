export type AuthUser = {
  id: string;
  name: string;
  role: 'ROLE_ADMIN' | 'ROLE_FINANCEIRO' | 'ROLE_ATENDENTE';
};

type StoredAuth = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = 'dimarcos.auth';

export const authStorage = {
  get(): StoredAuth | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredAuth;
    } catch {
      return null;
    }
  },
  set(data: StoredAuth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
  getToken() {
    return authStorage.get()?.token ?? null;
  }
};


