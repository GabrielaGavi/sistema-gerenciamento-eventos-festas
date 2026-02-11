import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { ClientRequest, ClientResponse, createClient, deleteClient, listClients, updateClient } from '../api/clients';

const emptyForm: ClientRequest = {
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  endereco: ''
};

export function Clientes() {
  const [clientes, setClientes] = useState<ClientResponse[]>([]);
  const [termo, setTermo] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClientResponse | null>(null);
  const [form, setForm] = useState<ClientRequest>(emptyForm);

  const title = useMemo(() => (editing ? 'Editar cliente' : 'Novo cliente'), [editing]);

  const loadClients = async (searchTerm?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listClients(searchTerm);
      setClientes(data);
    } catch (err) {
      setError('Não foi possível carregar clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClients();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (client: ClientResponse) => {
    setEditing(client);
    setForm({
      nome: client.nome,
      email: client.email,
      telefone: client.telefone,
      cpf: client.cpf,
      endereco: client.endereco
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload: ClientRequest = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim(),
      cpf: form.cpf.trim(),
      endereco: form.endereco.trim()
    };
    try {
      if (editing) {
        await updateClient(editing.id, payload);
      } else {
        await createClient(payload);
      }
      await loadClients(termo);
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Sem permissão para salvar cliente com este perfil.');
      } else if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        setError('Não foi possível salvar o cliente.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client: ClientResponse) => {
    if (!window.confirm(`Deseja excluir ${client.nome}?`)) return;
    try {
      await deleteClient(client.id);
      await loadClients(termo);
    } catch (err) {
      setError('Não foi possível excluir o cliente.');
    }
  };

  const handleFilter = () => {
    void loadClients(termo);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Clientes</Typography>
          <Typography variant="body2" color="text.secondary">
            Cadastro centralizado para histórico de eventos e contratos.
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleOpenCreate}>
          Novo cliente
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Buscar cliente"
              placeholder="Nome, contato ou telefone"
              fullWidth
              value={termo}
              onChange={(event) => setTermo(event.target.value)}
            />
            <Button variant="outlined" onClick={handleFilter} disabled={loading}>
              {loading ? 'Carregando...' : 'Filtrar'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Stack spacing={2}>
        {clientes.length === 0 && !loading ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum cliente encontrado.
          </Typography>
        ) : (
          clientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  #{cliente.id}
                </Typography>
                <Typography variant="h6">{cliente.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cliente.email} • {cliente.telefone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CPF: {cliente.cpf} • {cliente.endereco}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button size="small" variant="outlined" onClick={() => handleOpenEdit(cliente)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" variant="text" onClick={() => handleDelete(cliente)}>
                    Excluir
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              value={form.nome}
              onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <TextField
              label="Telefone"
              value={form.telefone}
              onChange={(event) => setForm((prev) => ({ ...prev, telefone: event.target.value }))}
              required
            />
            <TextField
              label="CPF"
              value={form.cpf}
              onChange={(event) => setForm((prev) => ({ ...prev, cpf: event.target.value }))}
              required
            />
            <TextField
              label="Endereço"
              value={form.endereco}
              onChange={(event) => setForm((prev) => ({ ...prev, endereco: event.target.value }))}
              required
              multiline
              minRows={2}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={handleClose} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
