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
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import {
  CashEntry,
  CashEntryRequest,
  CashPaymentRequest,
  CashSummary,
  createEntry,
  createExpense,
  getCashSummary,
  listCash
} from '../api/cash';
import { EventResponse, listEvents } from '../api/events';

const paymentMethods = [
  { label: 'PIX', value: 'PIX' },
  { label: 'Cartao', value: 'CARTAO' },
  { label: 'Dinheiro', value: 'DINHEIRO' },
  { label: 'Transferencia', value: 'TRANSFERENCIA' }
] as const;

const operationOptions = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Entradas', value: 'ENTRADA' },
  { label: 'Saidas', value: 'SAIDA' }
] as const;

const formatCurrency = (value: number | string) => {
  const amount = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(amount)) return '-';
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR');
};

const formatEventOption = (event: EventResponse) => {
  const when = event.dataHoraEvento || event.dataHoraVisita;
  const kind = event.tipoEvento === 'FESTA' ? 'Festa' : 'Visita';
  return `#${event.id} - ${kind} - ${formatDateTime(when)} - ${event.statusEvento} - ${event.client?.nome || 'Sem cliente'}`;
};

const buildBoundary = (date: string | null, mode: 'start' | 'end') => {
  if (!date) return undefined;
  const suffix = mode === 'start' ? 'T00:00:00' : 'T23:59:59';
  return `${date}${suffix}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return fallback;
};

type EntryFormState = {
  eventId: string;
  formaPagamento: CashPaymentRequest['formaPagamento'];
  valor: string;
  data: string;
  observacao: string;
};

type ExpenseFormState = {
  formaPagamento: CashEntryRequest['formaPagamento'];
  valor: string;
  data: string;
  observacao: string;
};

const initialEntryForm: EntryFormState = {
  eventId: '',
  formaPagamento: 'PIX',
  valor: '',
  data: '',
  observacao: ''
};

const initialExpenseForm: ExpenseFormState = {
  formaPagamento: 'PIX',
  valor: '',
  data: '',
  observacao: ''
};

export function Financeiro() {
  const [entries, setEntries] = useState<CashEntry[]>([]);
  const [summary, setSummary] = useState<CashSummary | null>(null);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openEntry, setOpenEntry] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [operationFilter, setOperationFilter] = useState<'TODOS' | 'ENTRADA' | 'SAIDA'>('TODOS');
  const [search, setSearch] = useState('');
  const [entryForm, setEntryForm] = useState<EntryFormState>(initialEntryForm);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(initialExpenseForm);

  const totalLabel = useMemo(() => (summary ? formatCurrency(summary.total) : '-'), [summary]);
  const entradaLabel = useMemo(() => (summary ? formatCurrency(summary.entrada) : '-'), [summary]);
  const saidaLabel = useMemo(() => (summary ? formatCurrency(summary.saida) : '-'), [summary]);

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries
      .filter((entry) => (operationFilter === 'TODOS' ? true : entry.operacao === operationFilter))
      .filter((entry) => {
        if (!term) return true;
        return (
          String(entry.id).includes(term) ||
          (entry.observacao || '').toLowerCase().includes(term) ||
          entry.formaPagamento.toLowerCase().includes(term) ||
          entry.tipo.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [entries, operationFilter, search]);

  const loadCash = async () => {
    setLoading(true);
    setError(null);

    const from = buildBoundary(fromDate || null, 'start');
    const to = buildBoundary(toDate || null, 'end');

    try {
      const [cashList, cashSummary] = await Promise.all([listCash({ from, to }), getCashSummary({ from, to })]);
      setEntries(cashList);
      setSummary(cashSummary);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível carregar o financeiro.'));
    } finally {
      setLoading(false);
    }
  };

  const loadEventOptions = async () => {
    try {
      const data = await listEvents();
      setEvents(
        data
          .filter((event) => event.tipoEvento === 'FESTA' && event.statusEvento !== 'CANCELADO')
          .sort((a, b) => {
            const dateA = new Date(a.dataHoraEvento || a.dataHoraVisita || 0).getTime();
            const dateB = new Date(b.dataHoraEvento || b.dataHoraVisita || 0).getTime();
            return dateB - dateA;
          })
      );
    } catch {
      setEvents([]);
    }
  };

  useEffect(() => {
    void loadCash();
  }, [fromDate, toDate]);

  useEffect(() => {
    void loadEventOptions();
  }, []);

  const handleCreateEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const parsedEventId = Number(entryForm.eventId);
    const parsedValor = Number(entryForm.valor.replace(',', '.'));

    if (!Number.isFinite(parsedEventId) || parsedEventId <= 0 || !Number.isFinite(parsedValor) || parsedValor <= 0) {
      setSaving(false);
      setError('Preencha evento e valor com números válidos.');
      return;
    }

    try {
      await createEntry({
        formaPagamento: entryForm.formaPagamento,
        valor: parsedValor,
        eventId: parsedEventId,
        data: entryForm.data || undefined,
        observacao: entryForm.observacao || undefined
      });
      setOpenEntry(false);
      setEntryForm(initialEntryForm);
      await loadCash();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível registrar a entrada.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateExpense = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const parsedValor = Number(expenseForm.valor.replace(',', '.'));
    if (!Number.isFinite(parsedValor) || parsedValor <= 0) {
      setSaving(false);
      setError('Preencha o valor com um número válido.');
      return;
    }

    try {
      await createExpense({
        formaPagamento: expenseForm.formaPagamento,
        valor: parsedValor,
        data: expenseForm.data || undefined,
        observacao: expenseForm.observacao || undefined
      });
      setOpenExpense(false);
      setExpenseForm(initialExpenseForm);
      await loadCash();
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível registrar a saída.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Financeiro</Typography>
          <Typography variant="body2" color="text.secondary">
            Controle financeiro com entradas, saidas e saldo consolidado.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={() => setOpenExpense(true)}>
            Inserir saida
          </Button>
          <Button variant="contained" onClick={() => setOpenEntry(true)}>
            Inserir entrada
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Saldo atual
            </Typography>
            <Typography variant="h3">{totalLabel}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Entradas do periodo
            </Typography>
            <Typography variant="h3">{entradaLabel}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Saidas do periodo
            </Typography>
            <Typography variant="h3">{saidaLabel}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Buscar"
              placeholder="ID, observacao, tipo ou pagamento"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <TextField
              select
              label="Operacao"
              value={operationFilter}
              onChange={(event) => setOperationFilter(event.target.value as 'TODOS' | 'ENTRADA' | 'SAIDA')}
              sx={{ minWidth: 160 }}
            >
              {operationOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Data inicial"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
            <TextField
              label="Data final"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
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
        {filteredEntries.length === 0 && !loading ? (
          <Typography variant="body2" color="text.secondary">
            Nenhuma movimentacao encontrada.
          </Typography>
        ) : (
          filteredEntries.map((mov) => (
            <Card key={mov.id}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  #{mov.id} - {mov.operacao}
                </Typography>
                <Typography variant="h6">{mov.observacao || 'Movimentacao'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(mov.data)} - {mov.formaPagamento}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipo: {mov.tipo}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2 }}>
                  {formatCurrency(mov.valor)}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      <Dialog open={openEntry} onClose={() => setOpenEntry(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar entrada</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} onSubmit={handleCreateEntry}>
            <TextField
              select
              label="Evento"
              value={entryForm.eventId}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, eventId: event.target.value }))}
              required
            >
              {events.length === 0 && (
                <MenuItem value="" disabled>
                  Nenhuma festa disponivel para entrada
                </MenuItem>
              )}
              {events.map((ev) => (
                <MenuItem key={ev.id} value={String(ev.id)}>
                  {formatEventOption(ev)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Forma de pagamento"
              value={entryForm.formaPagamento}
              onChange={(event) =>
                setEntryForm((prev) => ({ ...prev, formaPagamento: event.target.value as CashPaymentRequest['formaPagamento'] }))
              }
              required
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Valor"
              type="text"
              value={entryForm.valor}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, valor: event.target.value }))}
              inputProps={{ inputMode: 'decimal' }}
              placeholder="Ex.: 1500,00"
              required
            />
            <TextField
              label="Data"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={entryForm.data}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, data: event.target.value }))}
            />
            <TextField
              label="Observacao"
              value={entryForm.observacao}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, observacao: event.target.value }))}
              multiline
              minRows={2}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenEntry(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Registrar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openExpense} onClose={() => setOpenExpense(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar saida</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} onSubmit={handleCreateExpense}>
            <TextField
              select
              label="Forma de pagamento"
              value={expenseForm.formaPagamento}
              onChange={(event) =>
                setExpenseForm((prev) => ({ ...prev, formaPagamento: event.target.value as CashEntryRequest['formaPagamento'] }))
              }
              required
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.value} value={method.value}>
                  {method.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Valor"
              type="text"
              value={expenseForm.valor}
              onChange={(event) => setExpenseForm((prev) => ({ ...prev, valor: event.target.value }))}
              inputProps={{ inputMode: 'decimal' }}
              placeholder="Ex.: 250,00"
              required
            />
            <TextField
              label="Data"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={expenseForm.data}
              onChange={(event) => setExpenseForm((prev) => ({ ...prev, data: event.target.value }))}
            />
            <TextField
              label="Observacao"
              value={expenseForm.observacao}
              onChange={(event) => setExpenseForm((prev) => ({ ...prev, observacao: event.target.value }))}
              multiline
              minRows={2}
            />
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setOpenExpense(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Salvando...' : 'Registrar'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
