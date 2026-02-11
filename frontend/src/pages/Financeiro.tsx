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

const paymentMethods = [
  { label: 'PIX', value: 'PIX' },
  { label: 'Cartão', value: 'CARTAO' },
  { label: 'Dinheiro', value: 'DINHEIRO' },
  { label: 'Transferência', value: 'TRANSFERENCIA' }
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openEntry, setOpenEntry] = useState(false);
  const [openExpense, setOpenExpense] = useState(false);
  const [entryForm, setEntryForm] = useState<EntryFormState>(initialEntryForm);
  const [expenseForm, setExpenseForm] = useState<ExpenseFormState>(initialExpenseForm);

  const totalLabel = useMemo(() => (summary ? formatCurrency(summary.total) : '-'), [summary]);
  const entradaLabel = useMemo(() => (summary ? formatCurrency(summary.entrada) : '-'), [summary]);
  const saidaLabel = useMemo(() => (summary ? formatCurrency(summary.saida) : '-'), [summary]);

  const loadCash = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cashList, cashSummary] = await Promise.all([listCash(), getCashSummary()]);
      setEntries(cashList);
      setSummary(cashSummary);
    } catch (err) {
      setError('Nao foi possivel carregar o financeiro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCash();
  }, []);

  const handleCreateEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const parsedEventId = Number(entryForm.eventId);
    const parsedValor = Number(entryForm.valor.replace(',', '.'));
    if (!Number.isFinite(parsedEventId) || parsedEventId <= 0 || !Number.isFinite(parsedValor) || parsedValor <= 0) {
      setSaving(false);
      setError('Preencha ID do evento e valor com numeros validos.');
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
      setError('Não foi possível registrar a entrada.');
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
      setError('Preencha o valor com um numero valido.');
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
      setError('Não foi possível registrar a saída.');
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
            Controle financeiro com entradas, saídas e saldo consolidado.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={() => setOpenExpense(true)}>
            Inserir saída
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
              Entradas do mês
            </Typography>
            <Typography variant="h3">{entradaLabel}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Saídas do mês
            </Typography>
            <Typography variant="h3">{saidaLabel}</Typography>
          </CardContent>
        </Card>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Stack spacing={2}>
        {entries.length === 0 && !loading ? (
          <Typography variant="body2" color="text.secondary">
            Nenhuma movimentação encontrada.
          </Typography>
        ) : (
          entries.map((mov) => (
            <Card key={mov.id}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  #{mov.id} • {mov.operacao}
                </Typography>
                <Typography variant="h6">{mov.observacao || 'Movimentação'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(mov.data)} • {mov.formaPagamento}
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
              label="ID do evento"
              type="text"
              value={entryForm.eventId}
              onChange={(event) => setEntryForm((prev) => ({ ...prev, eventId: event.target.value }))}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              placeholder="Ex.: 1"
              required
            />
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
              label="Observação"
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
        <DialogTitle>Registrar saída</DialogTitle>
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
              label="Observação"
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
