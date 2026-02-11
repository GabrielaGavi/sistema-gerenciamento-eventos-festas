package com.dimarcos.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dimarcos.backend.domain.CashEntry;
import com.dimarcos.backend.domain.Client;
import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.PaymentHistory;
import com.dimarcos.backend.domain.enums.CashOperation;
import com.dimarcos.backend.domain.enums.CashType;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;
import com.dimarcos.backend.domain.enums.PaymentType;
import com.dimarcos.backend.dto.CancelEventRequest;
import com.dimarcos.backend.dto.ConvertVisitToPartyRequest;
import com.dimarcos.backend.dto.EventPartyRequest;
import com.dimarcos.backend.dto.EventUpdateRequest;
import com.dimarcos.backend.dto.EventVisitRequest;
import com.dimarcos.backend.exception.BusinessException;
import com.dimarcos.backend.exception.ResourceNotFoundException;
import com.dimarcos.backend.repository.CashEntryRepository;
import com.dimarcos.backend.repository.ClientRepository;
import com.dimarcos.backend.repository.EventRepository;
import com.dimarcos.backend.repository.PaymentHistoryRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ClientRepository clientRepository;
    private final CashEntryRepository cashEntryRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;

    public EventService(
        EventRepository eventRepository,
        ClientRepository clientRepository,
        CashEntryRepository cashEntryRepository,
        PaymentHistoryRepository paymentHistoryRepository
    ) {
        this.eventRepository = eventRepository;
        this.clientRepository = clientRepository;
        this.cashEntryRepository = cashEntryRepository;
        this.paymentHistoryRepository = paymentHistoryRepository;
    }

    public List<Event> list(EventType tipo, EventStatus status, LocalDateTime dataFrom, LocalDateTime dataTo) {
        return eventRepository.findAllWithFilters(tipo, status, dataFrom, dataTo);
    }

    public Event get(Long id) {
        return eventRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Evento nao encontrado"));
    }

    @Transactional
    public Event createVisit(EventVisitRequest request) {
        Client client = resolveClient(request.getClientId(), request.getClient());
        Event event = new Event();
        event.setTipoEvento(EventType.VISITA);
        event.setStatusEvento(EventStatus.AGENDADO);
        event.setDataHoraVisita(request.getDataHoraVisita());
        event.setDataHoraEvento(request.getDataHoraEventoPretendida());
        event.setCategoria(request.getCategoria());
        event.setCapacidade(request.getCapacidade());
        event.setContratoGerado(false);
        event.setClient(client);
        return eventRepository.save(event);
    }

    @Transactional
    public Event createParty(EventPartyRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado"));

        validateNoConflict(request.getDataHoraEvento(), null);

        Event event = new Event();
        event.setTipoEvento(EventType.FESTA);
        event.setDataHoraEvento(request.getDataHoraEvento());
        event.setCapacidade(request.getCapacidade());
        event.setCategoria(request.getCategoria());
        event.setContratoGerado(false);
        applyFinancials(event, request.getValorTotal(), request.getValorEntrada(), request.getPreReservaValidadeDias());
        event.setDadosContrato(request.getDadosContrato());
        event.setClient(client);
        return eventRepository.save(event);
    }

    @Transactional
    public Event update(Long id, EventUpdateRequest request) {
        Event event = get(id);
        if (request.getDataHoraEvento() != null && event.getTipoEvento() == EventType.FESTA) {
            validateNoConflict(request.getDataHoraEvento(), event.getId());
            event.setDataHoraEvento(request.getDataHoraEvento());
        }
        if (request.getDataHoraVisita() != null) {
            event.setDataHoraVisita(request.getDataHoraVisita());
        }
        if (request.getCapacidade() != null) {
            event.setCapacidade(request.getCapacidade());
        }
        if (request.getCategoria() != null) {
            event.setCategoria(request.getCategoria());
        }
        if (request.getStatusEvento() != null) {
            event.setStatusEvento(request.getStatusEvento());
        }
        if (request.getValorTotal() != null) {
            event.setValorTotal(request.getValorTotal());
        }
        if (request.getValorPago() != null) {
            event.setValorPago(request.getValorPago());
        }
        if (request.getPreReservaValidadeDias() != null) {
            event.setPreReservaValidadeDias(request.getPreReservaValidadeDias());
        }
        if (request.getContratoGerado() != null) {
            event.setContratoGerado(request.getContratoGerado());
        }
        if (request.getDadosContrato() != null) {
            event.setDadosContrato(request.getDadosContrato());
        }
        return eventRepository.save(event);
    }

    @Transactional
    public Event convertVisitToParty(Long id, ConvertVisitToPartyRequest request) {
        Event event = get(id);
        if (event.getTipoEvento() != EventType.VISITA) {
            throw new BusinessException("Apenas visitas podem ser convertidas");
        }

        validateNoConflict(request.getDataHoraEvento(), event.getId());

        event.setTipoEvento(EventType.FESTA);
        event.setDataHoraEvento(request.getDataHoraEvento());
        event.setCapacidade(request.getCapacidade());
        event.setCategoria(request.getCategoria());
        event.setDadosContrato(request.getDadosContrato());
        applyFinancials(event, request.getValorTotal(), request.getValorEntrada(), request.getPreReservaValidadeDias());

        return eventRepository.save(event);
    }

    @Transactional
    public Event cancelAndRefund(Long id, CancelEventRequest request) {
        Event event = get(id);
        if (event.getStatusEvento() == EventStatus.CANCELADO) {
            throw new BusinessException("Evento ja esta cancelado");
        }
        event.setStatusEvento(EventStatus.CANCELADO);

        LocalDateTime data = request.getData() == null ? LocalDateTime.now() : request.getData();

        CashEntry cashEntry = new CashEntry();
        cashEntry.setData(data);
        cashEntry.setFormaPagamento(request.getFormaPagamento());
        cashEntry.setOperacao(CashOperation.SAIDA);
        cashEntry.setTipo(CashType.REEMBOLSO);
        cashEntry.setValor(request.getValorReembolso());
        cashEntry.setObservacao(request.getObservacao());
        cashEntry.setEvent(event);

        PaymentHistory history = new PaymentHistory();
        history.setClient(event.getClient());
        history.setEvent(event);
        history.setValor(request.getValorReembolso());
        history.setData(data);
        history.setTipo(PaymentType.REEMBOLSO);

        eventRepository.save(event);
        cashEntryRepository.save(cashEntry);
        paymentHistoryRepository.save(history);

        return event;
    }

    private void validateNoConflict(LocalDateTime dataHoraEvento, Long eventId) {
        if (dataHoraEvento == null) {
            throw new BusinessException("Data/hora da festa e obrigatoria");
        }
        boolean conflict;
        if (eventId == null) {
            conflict = eventRepository.existsByTipoEventoAndDataHoraEventoAndStatusEventoNot(
                EventType.FESTA,
                dataHoraEvento,
                EventStatus.CANCELADO
            );
        } else {
            conflict = eventRepository.existsByTipoEventoAndDataHoraEventoAndStatusEventoNotAndIdNot(
                EventType.FESTA,
                dataHoraEvento,
                EventStatus.CANCELADO,
                eventId
            );
        }
        if (conflict) {
            throw new BusinessException("Conflito de agenda: ja existe festa nesse horario");
        }
    }

    private void applyFinancials(
        Event event,
        BigDecimal valorTotal,
        BigDecimal valorEntrada,
        Integer preReservaValidadeDias
    ) {
        if (valorTotal == null) {
            throw new BusinessException("Valor total e obrigatorio");
        }
        event.setValorTotal(valorTotal);
        BigDecimal entrada = valorEntrada == null ? BigDecimal.ZERO : valorEntrada;
        if (entrada.compareTo(BigDecimal.ZERO) > 0) {
            event.setStatusEvento(EventStatus.CONFIRMADO);
            event.setValorPago(entrada);
            event.setPreReservaValidadeDias(null);
        } else {
            if (preReservaValidadeDias == null || preReservaValidadeDias <= 0) {
                throw new BusinessException("Pre-reserva exige validade em dias");
            }
            event.setStatusEvento(EventStatus.PRE_RESERVA);
            event.setValorPago(BigDecimal.ZERO);
            event.setPreReservaValidadeDias(preReservaValidadeDias);
        }
    }

    private Client resolveClient(Long clientId, com.dimarcos.backend.dto.ClientRequest clientRequest) {
        boolean hasId = clientId != null;
        boolean hasPayload = clientRequest != null;
        if (hasId == hasPayload) {
            throw new BusinessException("Informe clientId ou dados do cliente");
        }
        if (hasId) {
            return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado"));
        }
        if (clientRepository.existsByCpf(clientRequest.getCpf())) {
            throw new BusinessException("CPF ja cadastrado");
        }
        Client client = new Client();
        client.setNome(clientRequest.getNome());
        client.setEmail(clientRequest.getEmail());
        client.setTelefone(clientRequest.getTelefone());
        client.setCpf(clientRequest.getCpf());
        client.setEndereco(clientRequest.getEndereco());
        return clientRepository.save(client);
    }
}
