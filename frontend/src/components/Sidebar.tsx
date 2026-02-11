import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { listPartiesAgenda, listVisitsAgenda } from '../api/dashboard';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Eventos', to: '/eventos', icon: <EventAvailableIcon /> },
  { label: 'Clientes', to: '/clientes', icon: <PeopleAltIcon /> },
  { label: 'Financeiro', to: '/financeiro', icon: <AccountBalanceIcon /> }
];

export function Sidebar() {
  const [parties, setParties] = useState(0);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [partiesData, visitsData] = await Promise.all([listPartiesAgenda(), listVisitsAgenda()]);
        setParties(partiesData.length);
        setVisits(visitsData.length);
      } catch {
        setParties(0);
        setVisits(0);
      }
    };

    void load();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        borderRight: '1px solid var(--line)',
        backgroundColor: 'rgba(255,255,255,0.95)',
        minHeight: '100vh',
        position: { xs: 'static', md: 'sticky' },
        top: 0
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
        Dimarcos
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Eventos e Festas
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item) => (
          <Box
            key={item.to}
            component={NavLink}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textDecoration: 'none',
              color: 'inherit',
              padding: '10px 14px',
              borderRadius: 12,
              background: isActive ? 'rgba(30, 58, 138, 0.12)' : 'transparent'
            })}
          >
            {item.icon}
            <Typography variant="body1" fontWeight={600}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(30,58,138,0.15), rgba(217,119,6,0.18))'
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Proxima semana
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {parties} festas + {visits} visitas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dados em tempo real do dashboard.
        </Typography>
      </Box>
    </Box>
  );
}
