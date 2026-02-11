package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public class CashEntryRequest {

    @NotNull
    private PaymentMethod formaPagamento;

    @NotNull
    private BigDecimal valor;

    private LocalDateTime data;

    private String observacao;

    public PaymentMethod getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(PaymentMethod formaPagamento) {
        this.formaPagamento = formaPagamento;
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

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
