package com.dimarcos.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dimarcos.backend.domain.PaymentHistory;
import com.dimarcos.backend.repository.PaymentHistoryRepository;

@Service
public class PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;

    public PaymentHistoryService(PaymentHistoryRepository paymentHistoryRepository) {
        this.paymentHistoryRepository = paymentHistoryRepository;
    }

    public List<PaymentHistory> list(Long clientId, Long eventId, LocalDateTime from, LocalDateTime to) {
        if (clientId != null) {
            return paymentHistoryRepository.findByClientId(clientId);
        }
        if (eventId != null) {
            return paymentHistoryRepository.findByEventId(eventId);
        }
        if (from != null && to != null) {
            return paymentHistoryRepository.findByDataBetween(from, to);
        }
        return paymentHistoryRepository.findAll();
    }
}
