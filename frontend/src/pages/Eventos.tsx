import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const eventos = [
  {
    id: 'EVT-204',
    nome: 'Festa de 15 anos - Lara',
    data: '12/02/2026',
    status: 'Pendente',
    cliente: 'Familia Andrade'
  },
  {
    id: 'EVT-205',
    nome: 'Casamento Beatriz & Hugo',
    data: '16/02/2026',
    status: 'Confirmado',
    cliente: 'Beatriz Ribeiro'
  },
  {
    id: 'EVT-206',
    nome: 'Evento corporativo TechHub',
    data: '20/02/2026',
    status: 'Em visita',
    cliente: 'TechHub'
  }
];

const statusOptions = ['Todos', 'Pendente', 'Confirmado', 'Em visita', 'Cancelado'] as const;

export function Eventos() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Eventos</Typography>
          <Typography variant="body2" color="text.secondary">
            Organize eventos, visitas e conversões em um só fluxo.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined">Criar visita</Button>
          <Button variant="contained">Novo evento</Button>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Buscar" placeholder="Nome, cliente ou ID" fullWidth />
            <TextField select label="Status" defaultValue="Todos" sx={{ minWidth: 180 }}>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Data" type="date" InputLabelProps={{ shrink: true }} />
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {eventos.map((evento) => (
          <Card key={evento.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {evento.id}
                  </Typography>
                  <Typography variant="h6">{evento.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {evento.cliente} • {evento.data}
                  </Typography>
                </Box>
                <Chip label={evento.status} color={evento.status === 'Confirmado' ? 'success' : 'default'} />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button size="small" variant="outlined">
                  Converter
                </Button>
                <Button size="small" variant="outlined">
                  Criar visita
                </Button>
                <Button size="small" color="error" variant="text">
                  Cancelar
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}


