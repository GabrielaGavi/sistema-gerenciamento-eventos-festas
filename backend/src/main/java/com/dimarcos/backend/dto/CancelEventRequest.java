package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.PaymentMethod;

import jakarta.validation.constraints.NotNull;

public class CancelEventRequest {

    @NotNull
    private BigDecimal valorReembolso;

    @NotNull
    private PaymentMethod formaPagamento;

    private LocalDateTime data;

    private String observacao;

    public BigDecimal getValorReembolso() {
        return valorReembolso;
    }

    public void setValorReembolso(BigDecimal valorReembolso) {
        this.valorReembolso = valorReembolso;
    }

    public PaymentMethod getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(PaymentMethod formaPagamento) {
        this.formaPagamento = formaPagamento;
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
