package com.dimarcos.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dimarcos.backend.domain.Client;
import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;
import com.dimarcos.backend.domain.enums.PaymentMethod;
import com.dimarcos.backend.dto.CancelEventRequest;
import com.dimarcos.backend.dto.ConvertVisitToPartyRequest;
import com.dimarcos.backend.dto.EventPartyRequest;
import com.dimarcos.backend.exception.BusinessException;
import com.dimarcos.backend.repository.CashEntryRepository;
import com.dimarcos.backend.repository.ClientRepository;
import com.dimarcos.backend.repository.EventRepository;
import com.dimarcos.backend.repository.PaymentHistoryRepository;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private CashEntryRepository cashEntryRepository;

    @Mock
    private PaymentHistoryRepository paymentHistoryRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createPartyShouldFailWhenConflictExists() {
        Client client = new Client();
        client.setId(1L);
        when(clientRepository.findById(1L)).thenReturn(Optional.of(client));
        when(eventRepository.existsByTipoEventoAndDataHoraEventoAndStatusEventoNot(
            EventType.FESTA,
            LocalDateTime.of(2026, 2, 10, 18, 0),
            EventStatus.CANCELADO
        )).thenReturn(true);

        EventPartyRequest request = new EventPartyRequest();
        request.setClientId(1L);
        request.setDataHoraEvento(LocalDateTime.of(2026, 2, 10, 18, 0));
        request.setValorTotal(new BigDecimal("3000.00"));
        request.setValorEntrada(BigDecimal.ZERO);
        request.setPreReservaValidadeDias(7);

        assertThrows(BusinessException.class, () -> eventService.createParty(request));
    }

    @Test
    void convertVisitToPartyShouldSetPreReservaWhenNoEntry() {
        Client client = new Client();
        client.setId(2L);

        Event event = new Event();
        event.setId(10L);
        event.setTipoEvento(EventType.VISITA);
        event.setStatusEvento(EventStatus.AGENDADO);
        event.setClient(client);

        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));
        when(eventRepository.existsByTipoEventoAndDataHoraEventoAndStatusEventoNotAndIdNot(
            EventType.FESTA,
            LocalDateTime.of(2026, 2, 12, 14, 0),
            EventStatus.CANCELADO,
            10L
        )).thenReturn(false);
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ConvertVisitToPartyRequest request = new ConvertVisitToPartyRequest();
        request.setDataHoraEvento(LocalDateTime.of(2026, 2, 12, 14, 0));
        request.setValorTotal(new BigDecimal("4000.00"));
        request.setValorEntrada(BigDecimal.ZERO);
        request.setPreReservaValidadeDias(5);

        Event result = eventService.convertVisitToParty(10L, request);

        assertEquals(EventStatus.PRE_RESERVA, result.getStatusEvento());
        assertEquals(BigDecimal.ZERO, result.getValorPago());
    }

    @Test
    void cancelAndRefundShouldCreateEntries() {
        Client client = new Client();
        client.setId(3L);

        Event event = new Event();
        event.setId(20L);
        event.setTipoEvento(EventType.FESTA);
        event.setStatusEvento(EventStatus.CONFIRMADO);
        event.setClient(client);

        when(eventRepository.findById(20L)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cashEntryRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(paymentHistoryRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        CancelEventRequest request = new CancelEventRequest();
        request.setValorReembolso(new BigDecimal("500.00"));
        request.setFormaPagamento(PaymentMethod.PIX);

        Event result = eventService.cancelAndRefund(20L, request);

        assertEquals(EventStatus.CANCELADO, result.getStatusEvento());
        verify(cashEntryRepository, times(1)).save(any());
        verify(paymentHistoryRepository, times(1)).save(any());
    }
}
