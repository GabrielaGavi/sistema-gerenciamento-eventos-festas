package com.dimarcos.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dimarcos.backend.domain.CashEntry;
import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.PaymentHistory;
import com.dimarcos.backend.domain.enums.CashOperation;
import com.dimarcos.backend.domain.enums.CashType;
import com.dimarcos.backend.domain.enums.PaymentType;
import com.dimarcos.backend.dto.CashEntryRequest;
import com.dimarcos.backend.dto.CashPaymentRequest;
import com.dimarcos.backend.dto.CashSummaryResponse;
import com.dimarcos.backend.exception.BusinessException;
import com.dimarcos.backend.exception.ResourceNotFoundException;
import com.dimarcos.backend.repository.CashEntryRepository;
import com.dimarcos.backend.repository.EventRepository;
import com.dimarcos.backend.repository.PaymentHistoryRepository;

@Service
public class CashService {

    private final CashEntryRepository cashEntryRepository;
    private final EventRepository eventRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;

    public CashService(
        CashEntryRepository cashEntryRepository,
        EventRepository eventRepository,
        PaymentHistoryRepository paymentHistoryRepository
    ) {
        this.cashEntryRepository = cashEntryRepository;
        this.eventRepository = eventRepository;
        this.paymentHistoryRepository = paymentHistoryRepository;
    }

    public List<CashEntry> list(LocalDateTime from, LocalDateTime to) {
        if (from == null && to == null) {
            return cashEntryRepository.findAll();
        }
        LocalDateTime start = from == null ? LocalDateTime.MIN : from;
        LocalDateTime end = to == null ? LocalDateTime.MAX : to;
        return cashEntryRepository.findByDataBetween(start, end);
    }

    public CashSummaryResponse summary(LocalDateTime from, LocalDateTime to) {
        Object[] values = cashEntryRepository.sumEntriesAndExits(from, to);
        BigDecimal entrada = (BigDecimal) values[0];
        BigDecimal saida = (BigDecimal) values[1];
        return new CashSummaryResponse(entrada, saida);
    }

    @Transactional
    public CashEntry createExpense(CashEntryRequest request) {
        CashEntry entry = new CashEntry();
        entry.setData(resolveDate(request.getData()));
        entry.setFormaPagamento(request.getFormaPagamento());
        entry.setOperacao(CashOperation.SAIDA);
        entry.setTipo(CashType.DESPESA);
        entry.setValor(request.getValor());
        entry.setObservacao(request.getObservacao());
        return cashEntryRepository.save(entry);
    }

    @Transactional
    public CashEntry createEntry(CashPaymentRequest request) {
        Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new ResourceNotFoundException("Evento nao encontrado"));
        if (request.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor da entrada deve ser maior que zero");
        }
        LocalDateTime data = resolveDate(request.getData());

        PaymentHistory history = new PaymentHistory();
        history.setClient(event.getClient());
        history.setEvent(event);
        history.setValor(request.getValor());
        history.setData(data);
        history.setTipo(PaymentType.PAGAMENTO);

        CashEntry entry = new CashEntry();
        entry.setData(data);
        entry.setFormaPagamento(request.getFormaPagamento());
        entry.setOperacao(CashOperation.ENTRADA);
        entry.setTipo(CashType.EVENTO);
        entry.setValor(request.getValor());
        entry.setObservacao(request.getObservacao());
        entry.setEvent(event);

        BigDecimal valorPago = event.getValorPago() == null ? BigDecimal.ZERO : event.getValorPago();
        event.setValorPago(valorPago.add(request.getValor()));
        eventRepository.save(event);
        paymentHistoryRepository.save(history);
        return cashEntryRepository.save(entry);
    }

    @Transactional
    public CashEntry createRefund(CashPaymentRequest request) {
        Event event = eventRepository.findById(request.getEventId())
            .orElseThrow(() -> new ResourceNotFoundException("Evento nao encontrado"));
        if (request.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Valor do reembolso deve ser maior que zero");
        }
        LocalDateTime data = resolveDate(request.getData());

        PaymentHistory history = new PaymentHistory();
        history.setClient(event.getClient());
        history.setEvent(event);
        history.setValor(request.getValor());
        history.setData(data);
        history.setTipo(PaymentType.REEMBOLSO);

        CashEntry entry = new CashEntry();
        entry.setData(data);
        entry.setFormaPagamento(request.getFormaPagamento());
        entry.setOperacao(CashOperation.SAIDA);
        entry.setTipo(CashType.REEMBOLSO);
        entry.setValor(request.getValor());
        entry.setObservacao(request.getObservacao());
        entry.setEvent(event);

        paymentHistoryRepository.save(history);
        return cashEntryRepository.save(entry);
    }

    private LocalDateTime resolveDate(LocalDateTime data) {
        return data == null ? LocalDateTime.now() : data;
    }
}
