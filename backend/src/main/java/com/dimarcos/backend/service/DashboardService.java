package com.dimarcos.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;
import com.dimarcos.backend.repository.EventRepository;

@Service
public class DashboardService {

    private final EventRepository eventRepository;

    public DashboardService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> listPartiesAgenda() {
        return eventRepository.findByTipoEventoOrderByDataHoraEventoAsc(EventType.FESTA);
    }

    public List<Event> listVisitsAgenda() {
        return eventRepository.findByTipoEventoOrderByDataHoraVisitaAsc(EventType.VISITA);
    }

    public List<Event> listContractsPending() {
        return eventRepository.findByContratoGeradoFalseAndStatusEventoIn(
            List.of(EventStatus.PRE_RESERVA, EventStatus.CONFIRMADO)
        );
    }

    public List<Event> listCanceled() {
        return eventRepository.findByStatusEvento(EventStatus.CANCELADO);
    }
}
