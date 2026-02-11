import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Eventos } from './pages/Eventos';
import { Clientes } from './pages/Clientes';
import { Financeiro } from './pages/Financeiro';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="financeiro" element={<Financeiro />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </RouterRoutes>
  );
}


