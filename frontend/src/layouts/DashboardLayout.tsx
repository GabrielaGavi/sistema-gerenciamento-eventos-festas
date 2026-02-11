import { Outlet } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../auth/useAuth';

export function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <Box className="app-shell">
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid var(--line)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(6px)'
          }}
        >
          <Typography variant="h5">Painel Administrativo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.name}
            </Typography>
            <IconButton onClick={logout} aria-label="sair">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}


