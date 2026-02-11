import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { listContractsPending, listPartiesAgenda, listVisitsAgenda } from '../api/dashboard';

type DashboardCount = {
  contractsPending: number;
  partiesAgenda: number;
  visitsAgenda: number;
};

export function Dashboard() {
  const [counts, setCounts] = useState<DashboardCount>({
    contractsPending: 0,
    partiesAgenda: 0,
    visitsAgenda: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setError(null);
      try {
        const [contracts, parties, visits] = await Promise.all([
          listContractsPending(),
          listPartiesAgenda(),
          listVisitsAgenda()
        ]);
        setCounts({
          contractsPending: contracts.length,
          partiesAgenda: parties.length,
          visitsAgenda: visits.length
        });
      } catch {
        setCounts({
          contractsPending: 0,
          partiesAgenda: 0,
          visitsAgenda: 0
        });
        setError('Nao foi possivel carregar os dados do dashboard.');
      }
    };

    void loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'Contratos pendentes',
        value: String(counts.contractsPending),
        detail: 'Total de contratos aguardando assinatura ou pagamento.'
      },
      {
        title: 'Agenda de festas',
        value: String(counts.partiesAgenda),
        detail: 'Total de festas agendadas.'
      },
      {
        title: 'Agenda de visitas',
        value: String(counts.visitsAgenda),
        detail: 'Total de visitas agendadas.'
      }
    ],
    [counts]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4">Resumo do dia</Typography>
        <Typography variant="body2" color="text.secondary">
          Dados atualizados em tempo real a partir da API.
        </Typography>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {card.detail}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6">Operacoes prioritarias</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Revise contratos pendentes, agenda de visitas e financeiro da semana.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
