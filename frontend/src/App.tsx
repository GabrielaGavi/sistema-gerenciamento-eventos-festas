import { Routes } from './routes';
import { AuthProvider } from './auth/AuthProvider';

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}


