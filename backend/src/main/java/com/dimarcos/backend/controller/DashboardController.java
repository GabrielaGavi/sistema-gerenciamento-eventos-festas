package com.dimarcos.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dimarcos.backend.dto.DtoMapper;
import com.dimarcos.backend.dto.EventResponse;
import com.dimarcos.backend.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/parties-agenda")
    public List<EventResponse> partiesAgenda() {
        return dashboardService.listPartiesAgenda().stream().map(DtoMapper::toEventResponse).toList();
    }

    @GetMapping("/visits-agenda")
    public List<EventResponse> visitsAgenda() {
        return dashboardService.listVisitsAgenda().stream().map(DtoMapper::toEventResponse).toList();
    }

    @GetMapping("/contracts-pending")
    public List<EventResponse> contractsPending() {
        return dashboardService.listContractsPending().stream().map(DtoMapper::toEventResponse).toList();
    }

    @GetMapping("/events-canceled")
    public List<EventResponse> canceled() {
        return dashboardService.listCanceled().stream().map(DtoMapper::toEventResponse).toList();
    }
}
