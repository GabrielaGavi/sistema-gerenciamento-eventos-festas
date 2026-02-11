package com.dimarcos.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.EventCategory;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;

public class EventResponse {

    private Long id;
    private EventType tipoEvento;
    private LocalDateTime dataHoraEvento;
    private LocalDateTime dataHoraVisita;
    private Integer capacidade;
    private EventCategory categoria;
    private EventStatus statusEvento;
    private BigDecimal valorTotal;
    private BigDecimal valorPago;
    private Integer preReservaValidadeDias;
    private boolean contratoGerado;
    private String dadosContrato;
    private ClientResponse client;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EventType getTipoEvento() {
        return tipoEvento;
    }

    public void setTipoEvento(EventType tipoEvento) {
        this.tipoEvento = tipoEvento;
    }

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

    public boolean isContratoGerado() {
        return contratoGerado;
    }

    public void setContratoGerado(boolean contratoGerado) {
        this.contratoGerado = contratoGerado;
    }

    public String getDadosContrato() {
        return dadosContrato;
    }

    public void setDadosContrato(String dadosContrato) {
        this.dadosContrato = dadosContrato;
    }

    public ClientResponse getClient() {
        return client;
    }

    public void setClient(ClientResponse client) {
        this.client = client;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
