import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';
import { loginRequest, registerRequest } from '../api/auth';

const registerRoles = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Atendente', value: 'ATENDENTE' },
  { label: 'Financeiro', value: 'FINANCEIRO' }
] as const;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'ADMIN' | 'ATENDENTE' | 'FINANCEIRO'>('ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const auth = await loginRequest({ username, password });
      login(auth.token, {
        id: auth.username,
        name: auth.username,
        role: auth.role as 'ROLE_ADMIN' | 'ROLE_FINANCEIRO' | 'ROLE_ATENDENTE'
      });
      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Usuario ou senha invalidos.');
      } else {
        setError('Nao foi possivel autenticar. Verifique se o backend esta online.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      await registerRequest({
        username,
        password,
        role: registerRole
      });
      setInfo('Usuario registrado com sucesso. Agora faca login.');
      setMode('login');
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else {
        setError('Nao foi possivel registrar usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }
      }}
    >
      <Box
        sx={{
          p: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Typography variant="h2">Bem-vindo ao painel Dimarcos.</Typography>
        <Typography variant="body1" color="text.secondary">
          Controle de festas, contratos, visitas e financeiro em um so lugar.
        </Typography>
        <Box
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(30,58,138,0.12), rgba(217,119,6,0.2))'
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Status rapido
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acesse para ver os indicadores em tempo real.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 420 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5">Acessar conta</Typography>
            <Typography variant="body2" color="text.secondary">
              Use suas credenciais corporativas para entrar.
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={mode === 'login' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setInfo(null);
                }}
              >
                Login
              </Button>
              <Button
                variant={mode === 'register' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setInfo(null);
                }}
              >
                Registrar
              </Button>
            </Box>
            {info && <Alert severity="success">{info}</Alert>}
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={mode === 'login' ? handleLogin : handleRegister}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {mode === 'register' && (
                <TextField
                  select
                  label="Perfil"
                  value={registerRole}
                  onChange={(event) => setRegisterRole(event.target.value as 'ADMIN' | 'ATENDENTE' | 'FINANCEIRO')}
                >
                  {registerRoles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <Button size="large" variant="contained" type="submit" disabled={loading}>
                {loading ? 'Processando...' : mode === 'login' ? 'Entrar no painel' : 'Registrar usuario'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
