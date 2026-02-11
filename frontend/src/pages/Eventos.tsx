import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { listClients } from '../api/clients';
import {
  EventCategory,
  EventResponse,
  EventStatus,
  PaymentMethod,
  cancelEvent,
  convertVisitToParty,
  createParty,
  createVisit,
  listEvents
} from '../api/events';

const statusOptions: Array<{ label: string; value: EventStatus | 'TODOS' }> = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Solicitado', value: 'SOLICITADO' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Pré-reserva', value: 'PRE_RESERVA' },
  { label: 'Confirmado', value: 'CONFIRMADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Cancelado', value: 'CANCELADO' }
];

const categoryOptions: EventCategory[] = ['INFANTIL', 'CASAMENTO', 'CORPORATIVO', 'ANIVERSARIO', 'FORMATURA', 'OUTRO'];
const paymentOptions: PaymentMethod[] = ['PIX', 'CARTAO', 'DINHEIRO', 'TRANSFERENCIA'];

type ClientOption = { id: number; nome: string };

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR');
};

const parseMoney = (raw: string) => Number(raw.replace(',', '.'));

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  if (axios.isAxiosError(error) && error.response?.status === 403) {
    return 'Sem permissão para executar esta ação.';
  }
  return fallback;
};

export function Eventos() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EventStatus | 'TODOS'>('TODOS');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openVisit, setOpenVisit] = useState(false);
  const [openParty, setOpenParty] = useState(false);
  const [openConvertId, setOpenConvertId] = useState<number | null>(null);
  const [openCancelId, setOpenCancelId] = useState<number | null>(null);

  const [visitForm, setVisitForm] = useState({
    clientId: '',
    dataHoraVisita: '',
    dataHoraEventoPretendida: '',
    categoria: '',
    capacidade: ''
  });

  const [partyForm, setPartyForm] = useState({
    clientId: '',
    dataHoraEvento: '',
    categoria: '',
    capacidade: '',
    valorTotal: '',
    valorEntrada: '',
    preReservaValidadeDias: '',
    dadosContrato: ''
  });

  const [convertForm, setConvertForm] = useState({
    dataHoraEvento: '',
    categoria: '',
    capacidade: '',
    valorTotal: '',
    valorEntrada: '',
    preReservaValidadeDias: '',
    dadosContrato: ''
  });

  const [cancelForm, setCancelForm] = useState({
    valorReembolso: '',
    formaPagamento: 'PIX' as PaymentMethod,
    data: '',
    observacao: ''
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: {
        status?: EventStatus;
        dataFrom?: string;
        dataTo?: string;
      } = {};

      if (status !== 'TODOS') {
        params.status = status;
      }
      if (dateFilter) {
        params.dataFrom = `${dateFilter}T00:00:00`;
        params.dataTo = `${dateFilter}T23:59:59`;
      }

      const [eventsData, clientsData] = await Promise.all([listEvents(params), listClients()]);
      setEvents(eventsData);
      setClients(clientsData.map((client) => ({ id: client.id, nome: client.nome })));
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar eventos.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [status, dateFilter]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => {
      return (
        String(event.id).includes(term) ||
        event.client?.nome.toLowerCase().includes(term) ||
        event.statusEvento.toLowerCase().includes(term) ||
        event.tipoEvento.toLowerCase().includes(term)
      );
    });
  }, [events, search]);

  const createVisitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await createVisit({
        clientId: Number(visitForm.clientId),
        dataHoraVisita: visitForm.dataHoraVisita,
        dataHoraEventoPretendida: visitForm.dataHoraEventoPretendida || undefined,
        categoria: (visitForm.categoria || undefined) as EventCategory | undefined,
        capacidade: visitForm.capacidade ? Number(visitForm.capacidade) : undefined
      });
      setOpenVisit(false);
      setVisitForm({ clientId: '', dataHoraVisita: '', dataHoraEventoPretendida: '', categoria: '', capacidade: '' });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar visita.'));
    } finally {
      setSaving(false);
    }
  };

  const createPartyHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await createParty({
        clientId: Number(partyForm.clientId),
        dataHoraEvento: partyForm.dataHoraEvento,
        categoria: (partyForm.categoria || undefined) as EventCategory | undefined,
        capacidade: partyForm.capacidade ? Number(partyForm.capacidade) : undefined,
        valorTotal: parseMoney(partyForm.valorTotal),
        valorEntrada: partyForm.valorEntrada ? parseMoney(partyForm.valorEntrada) : undefined,
        preReservaValidadeDias: partyForm.preReservaValidadeDias ? Number(partyForm.preReservaValidadeDias) : undefined,
        dadosContrato: partyForm.dadosContrato || undefined
      });
      setOpenParty(false);
      setPartyForm({
        clientId: '',
        dataHoraEvento: '',
        categoria: '',
        capacidade: '',
        valorTotal: '',
        valorEntrada: '',
        preReservaValidadeDias: '',
        dadosContrato: ''
      });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar festa.'));
    } finally {
      setSaving(false);
    }
  };

  const convertHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!openConvertId) return;

    setSaving(true);
    setError(null);
    try {
      await convertVisitToParty(openConvertId, {
        dataHoraEvento: convertForm.dataHoraEvento,
        categoria: (convertForm.categoria || undefined) as EventCategory | undefined,
        capacidade: convertForm.capacidade ? Number(convertForm.capacidade) : undefined,
        valorTotal: parseMoney(convertForm.valorTotal),
        valorEntrada: convertForm.valorEntrada ? parseMoney(convertForm.valorEntrada) : undefined,
        preReservaValidadeDias: convertForm.preReservaValidadeDias ? Number(convertForm.preReservaValidadeDias) : undefined,
        dadosContrato: convertForm.dadosContrato || undefined
      });
      setOpenConvertId(null);
      setConvertForm({
        dataHoraEvento: '',
        categoria: '',
        capacidade: '',
        valorTotal: '',
        valorEntrada: '',
        preReservaValidadeDias: '',
        dadosContrato: ''
      });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível converter visita.'));
    } finally {
      setSaving(false);
    }
  };

  const cancelHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!openCancelId) return;

    setSaving(true);
    setError(null);
    try {
      await cancelEvent(openCancelId, {
        valorReembolso: parseMoney(cancelForm.valorReembolso),
        formaPagamento: cancelForm.formaPagamento,
        data: cancelForm.data || undefined,
        observacao: cancelForm.observacao || undefined
      });
      setOpenCancelId(null);
      setCancelForm({ valorReembolso: '', formaPagamento: 'PIX', data: '', observacao: '' });
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível cancelar evento.'));
    } finally {
      setSaving(false);
    }
  };

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
          <Button variant="outlined" onClick={() => setOpenVisit(true)}>
            Criar visita
          </Button>
          <Button variant="contained" onClick={() => setOpenParty(true)}>
            Novo evento
          </Button>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Buscar"
              placeholder="Cliente, status, tipo ou ID"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value as EventStatus | 'TODOS')}
              sx={{ minWidth: 180 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Stack spacing={2}>
        {!loading && filteredEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum evento encontrado.
          </Typography>
        ) : (
          filteredEvents.map((evento) => (
            <Card key={evento.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      EVT-{evento.id}
                    </Typography>
                    <Typography variant="h6">{evento.tipoEvento === 'VISITA' ? 'Visita' : 'Festa'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {evento.client?.nome} • {formatDate(evento.dataHoraEvento || evento.dataHoraVisita)}
                    </Typography>
                  </Box>
                  <Chip label={evento.statusEvento} color={evento.statusEvento === 'CONFIRMADO' ? 'success' : 'default'} />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setOpenConvertId(evento.id)}
                    disabled={evento.tipoEvento !== 'VISITA'}
                  >
                    Converter
                  </Button>
                  <Button size="small" color="error" variant="text" onClick={() => setOpenCancelId(evento.id)}>
                    Cancelar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={openVisit} onClose={() => setOpenVisit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Criar visita</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={createVisitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Cliente"
              value={visitForm.clientId}
              onChange={(event) => setVisitForm((prev) => ({ ...prev, clientId: event.target.value }))}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={String(client.id)}>
                  {client.nome} (#{client.id})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data/hora da visita"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={visitForm.dataHoraVisita}
              onChange={(event) => setVisitForm((prev) => ({ ...prev, dataHoraVisita: event.target.value }))}
              required
            />
            <TextField
              label="Data/hora pretendida da festa"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={visitForm.dataHoraEventoPretendida}
              onChange={(event) => setVisitForm((prev) => ({ ...prev, dataHoraEventoPretendida: event.target.value }))}
            />
            <TextField
              select
              label="Categoria"
              value={visitForm.categoria}
              onChange={(event) => setVisitForm((prev) => ({ ...prev, categoria: event.target.value }))}
            >
              <MenuItem value="">Sem categoria</MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Capacidade"
              type="number"
              value={visitForm.capacidade}
              onChange={(event) => setVisitForm((prev) => ({ ...prev, capacidade: event.target.value }))}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenVisit(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openParty} onClose={() => setOpenParty(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo evento (festa)</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={createPartyHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Cliente"
              value={partyForm.clientId}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, clientId: event.target.value }))}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={String(client.id)}>
                  {client.nome} (#{client.id})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data/hora da festa"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={partyForm.dataHoraEvento}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, dataHoraEvento: event.target.value }))}
              required
            />
            <TextField
              select
              label="Categoria"
              value={partyForm.categoria}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, categoria: event.target.value }))}
            >
              <MenuItem value="">Sem categoria</MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Capacidade"
              type="number"
              value={partyForm.capacidade}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, capacidade: event.target.value }))}
            />
            <TextField
              label="Valor total"
              value={partyForm.valorTotal}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, valorTotal: event.target.value }))}
              required
            />
            <TextField
              label="Valor de entrada"
              value={partyForm.valorEntrada}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, valorEntrada: event.target.value }))}
            />
            <TextField
              label="Validade da pré-reserva (dias)"
              type="number"
              value={partyForm.preReservaValidadeDias}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, preReservaValidadeDias: event.target.value }))}
            />
            <TextField
              label="Dados do contrato"
              multiline
              minRows={2}
              value={partyForm.dadosContrato}
              onChange={(event) => setPartyForm((prev) => ({ ...prev, dadosContrato: event.target.value }))}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenParty(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openConvertId !== null} onClose={() => setOpenConvertId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Converter visita para festa</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={convertHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Data/hora da festa"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={convertForm.dataHoraEvento}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, dataHoraEvento: event.target.value }))}
              required
            />
            <TextField
              select
              label="Categoria"
              value={convertForm.categoria}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, categoria: event.target.value }))}
            >
              <MenuItem value="">Sem categoria</MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Capacidade"
              type="number"
              value={convertForm.capacidade}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, capacidade: event.target.value }))}
            />
            <TextField
              label="Valor total"
              value={convertForm.valorTotal}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, valorTotal: event.target.value }))}
              required
            />
            <TextField
              label="Valor de entrada"
              value={convertForm.valorEntrada}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, valorEntrada: event.target.value }))}
            />
            <TextField
              label="Validade da pré-reserva (dias)"
              type="number"
              value={convertForm.preReservaValidadeDias}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, preReservaValidadeDias: event.target.value }))}
            />
            <TextField
              label="Dados do contrato"
              multiline
              minRows={2}
              value={convertForm.dadosContrato}
              onChange={(event) => setConvertForm((prev) => ({ ...prev, dadosContrato: event.target.value }))}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenConvertId(null)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Converter'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openCancelId !== null} onClose={() => setOpenCancelId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Cancelar evento</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={cancelHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Valor de reembolso"
              value={cancelForm.valorReembolso}
              onChange={(event) => setCancelForm((prev) => ({ ...prev, valorReembolso: event.target.value }))}
              required
            />
            <TextField
              select
              label="Forma de pagamento"
              value={cancelForm.formaPagamento}
              onChange={(event) => setCancelForm((prev) => ({ ...prev, formaPagamento: event.target.value as PaymentMethod }))}
              required
            >
              {paymentOptions.map((payment) => (
                <MenuItem key={payment} value={payment}>
                  {payment}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={cancelForm.data}
              onChange={(event) => setCancelForm((prev) => ({ ...prev, data: event.target.value }))}
            />
            <TextField
              label="Observação"
              multiline
              minRows={2}
              value={cancelForm.observacao}
              onChange={(event) => setCancelForm((prev) => ({ ...prev, observacao: event.target.value }))}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenCancelId(null)} disabled={saving}>
                Voltar
              </Button>
              <Button type="submit" color="error" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Confirmar cancelamento'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
