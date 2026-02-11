package com.dimarcos.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dimarcos.backend.dto.DtoMapper;
import com.dimarcos.backend.dto.PaymentHistoryResponse;
import com.dimarcos.backend.service.PaymentHistoryService;

@RestController
@RequestMapping("/payments")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;

    public PaymentHistoryController(PaymentHistoryService paymentHistoryService) {
        this.paymentHistoryService = paymentHistoryService;
    }

    @GetMapping
    public List<PaymentHistoryResponse> list(
        @RequestParam(required = false) Long clientId,
        @RequestParam(required = false) Long eventId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return paymentHistoryService.list(clientId, eventId, from, to).stream()
            .map(DtoMapper::toPaymentHistoryResponse)
            .toList();
    }
}
