import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const DEFAULT_ROLES = ['ROLE_ADMIN', 'ROLE_FINANCEIRO', 'ROLE_ATENDENTE'] as const;

type Role = typeof DEFAULT_ROLES[number];

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: Role[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}


