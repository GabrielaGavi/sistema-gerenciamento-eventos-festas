package com.dimarcos.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dimarcos.backend.domain.CashEntry;
import com.dimarcos.backend.dto.CashEntryRequest;
import com.dimarcos.backend.dto.CashPaymentRequest;
import com.dimarcos.backend.dto.CashSummaryResponse;
import com.dimarcos.backend.service.CashService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cash")
public class CashController {

    private final CashService cashService;

    public CashController(CashService cashService) {
        this.cashService = cashService;
    }

    @GetMapping
    public List<CashEntry> list(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return cashService.list(from, to);
    }

    @GetMapping("/summary")
    public CashSummaryResponse summary(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return cashService.summary(from, to);
    }

    @PostMapping("/entry")
    @ResponseStatus(HttpStatus.CREATED)
    public CashEntry createEntry(@Valid @RequestBody CashPaymentRequest request) {
        return cashService.createEntry(request);
    }

    @PostMapping("/expense")
    @ResponseStatus(HttpStatus.CREATED)
    public CashEntry createExpense(@Valid @RequestBody CashEntryRequest request) {
        return cashService.createExpense(request);
    }

    @PostMapping("/refund")
    @ResponseStatus(HttpStatus.CREATED)
    public CashEntry createRefund(@Valid @RequestBody CashPaymentRequest request) {
        return cashService.createRefund(request);
    }
}
