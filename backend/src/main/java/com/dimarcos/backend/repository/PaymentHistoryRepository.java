package com.dimarcos.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dimarcos.backend.domain.PaymentHistory;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

    List<PaymentHistory> findByClientId(Long clientId);

    List<PaymentHistory> findByEventId(Long eventId);

    List<PaymentHistory> findByDataBetween(LocalDateTime from, LocalDateTime to);
}
