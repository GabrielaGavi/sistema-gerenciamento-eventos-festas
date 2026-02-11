package com.dimarcos.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;
import com.dimarcos.backend.dto.CancelEventRequest;
import com.dimarcos.backend.dto.ConvertVisitToPartyRequest;
import com.dimarcos.backend.dto.DtoMapper;
import com.dimarcos.backend.dto.EventPartyRequest;
import com.dimarcos.backend.dto.EventResponse;
import com.dimarcos.backend.dto.EventUpdateRequest;
import com.dimarcos.backend.dto.EventVisitRequest;
import com.dimarcos.backend.service.EventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<EventResponse> list(
        @RequestParam(required = false) EventType tipo,
        @RequestParam(required = false) EventStatus status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFrom,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataTo
    ) {
        return eventService.list(tipo, status, dataFrom, dataTo).stream()
            .map(DtoMapper::toEventResponse)
            .toList();
    }

    @GetMapping("/{id:\\d+}")
    public EventResponse get(@PathVariable Long id) {
        return DtoMapper.toEventResponse(eventService.get(id));
    }

    @GetMapping("/canceled")
    public List<EventResponse> canceled() {
        return eventService.list(null, EventStatus.CANCELADO, null, null).stream()
            .map(DtoMapper::toEventResponse)
            .toList();
    }

    @PostMapping("/visits")
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createVisit(@Valid @RequestBody EventVisitRequest request) {
        return DtoMapper.toEventResponse(eventService.createVisit(request));
    }

    @PostMapping("/parties")
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse createParty(@Valid @RequestBody EventPartyRequest request) {
        return DtoMapper.toEventResponse(eventService.createParty(request));
    }

    @PutMapping("/{id:\\d+}")
    public EventResponse update(@PathVariable Long id, @RequestBody EventUpdateRequest request) {
        return DtoMapper.toEventResponse(eventService.update(id, request));
    }

    @PutMapping("/{id:\\d+}/convert-to-party")
    public EventResponse convertToParty(
        @PathVariable Long id,
        @Valid @RequestBody ConvertVisitToPartyRequest request
    ) {
        return DtoMapper.toEventResponse(eventService.convertVisitToParty(id, request));
    }

    @PutMapping("/{id:\\d+}/cancel")
    public EventResponse cancel(@PathVariable Long id, @Valid @RequestBody CancelEventRequest request) {
        return DtoMapper.toEventResponse(eventService.cancelAndRefund(id, request));
    }
}
