package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.PaymentType;

public class PaymentHistoryResponse {

    private Long id;
    private Long clientId;
    private Long eventId;
    private BigDecimal valor;
    private LocalDateTime data;
    private PaymentType tipo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public PaymentType getTipo() {
        return tipo;
    }

    public void setTipo(PaymentType tipo) {
        this.tipo = tipo;
    }
}
