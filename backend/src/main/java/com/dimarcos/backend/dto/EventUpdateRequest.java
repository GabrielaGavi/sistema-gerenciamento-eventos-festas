package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.EventCategory;
import com.dimarcos.backend.domain.enums.EventStatus;

public class EventUpdateRequest {

    private LocalDateTime dataHoraEvento;
    private LocalDateTime dataHoraVisita;
    private Integer capacidade;
    private EventCategory categoria;
    private EventStatus statusEvento;
    private BigDecimal valorTotal;
    private BigDecimal valorPago;
    private Integer preReservaValidadeDias;
    private Boolean contratoGerado;
    private String dadosContrato;

    public LocalDateTime getDataHoraEvento() {
        return dataHoraEvento;
    }

    public void setDataHoraEvento(LocalDateTime dataHoraEvento) {
        this.dataHoraEvento = dataHoraEvento;
    }

    public LocalDateTime getDataHoraVisita() {
        return dataHoraVisita;
    }

    public void setDataHoraVisita(LocalDateTime dataHoraVisita) {
        this.dataHoraVisita = dataHoraVisita;
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

    public EventStatus getStatusEvento() {
        return statusEvento;
    }

    public void setStatusEvento(EventStatus statusEvento) {
        this.statusEvento = statusEvento;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public Integer getPreReservaValidadeDias() {
        return preReservaValidadeDias;
    }

    public void setPreReservaValidadeDias(Integer preReservaValidadeDias) {
        this.preReservaValidadeDias = preReservaValidadeDias;
    }

    public Boolean getContratoGerado() {
        return contratoGerado;
    }

    public void setContratoGerado(Boolean contratoGerado) {
        this.contratoGerado = contratoGerado;
    }

    public String getDadosContrato() {
        return dadosContrato;
    }

    public void setDadosContrato(String dadosContrato) {
        this.dadosContrato = dadosContrato;
    }
}
