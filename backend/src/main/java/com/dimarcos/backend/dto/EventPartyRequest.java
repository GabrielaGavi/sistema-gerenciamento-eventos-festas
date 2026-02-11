package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.EventCategory;

import jakarta.validation.constraints.NotNull;

public class EventPartyRequest {

    @NotNull
    private Long clientId;

    @NotNull
    private LocalDateTime dataHoraEvento;

    private Integer capacidade;

    private EventCategory categoria;

    @NotNull
    private BigDecimal valorTotal;

    private BigDecimal valorEntrada;

    private Integer preReservaValidadeDias;

    private String dadosContrato;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public LocalDateTime getDataHoraEvento() {
        return dataHoraEvento;
    }

    public void setDataHoraEvento(LocalDateTime dataHoraEvento) {
        this.dataHoraEvento = dataHoraEvento;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }

    public EventCategory getCategoria() {
        return categoria;
    }

    public void setCategoria(EventCategory categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public BigDecimal getValorEntrada() {
        return valorEntrada;
    }

    public void setValorEntrada(BigDecimal valorEntrada) {
        this.valorEntrada = valorEntrada;
    }

    public Integer getPreReservaValidadeDias() {
        return preReservaValidadeDias;
    }

    public void setPreReservaValidadeDias(Integer preReservaValidadeDias) {
        this.preReservaValidadeDias = preReservaValidadeDias;
    }

    public String getDadosContrato() {
        return dadosContrato;
    }

    public void setDadosContrato(String dadosContrato) {
        this.dadosContrato = dadosContrato;
    }
}
