package com.dimarcos.backend.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.CashOperation;
import com.dimarcos.backend.domain.enums.CashType;
import com.dimarcos.backend.domain.enums.PaymentMethod;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cash_entries")
public class CashEntry extends BaseEntity {

    @Column(nullable = false)
    private LocalDateTime data;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod formaPagamento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CashOperation operacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CashType tipo;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    private String observacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public PaymentMethod getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(PaymentMethod formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

    public CashOperation getOperacao() {
        return operacao;
    }

    public void setOperacao(CashOperation operacao) {
        this.operacao = operacao;
    }

    public CashType getTipo() {
        return tipo;
    }

    public void setTipo(CashType tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}
