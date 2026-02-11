package com.dimarcos.backend.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.EventCategory;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType tipoEvento;

    private LocalDateTime dataHoraEvento;

    private LocalDateTime dataHoraVisita;

    private Integer capacidade;

    @Enumerated(EnumType.STRING)
    private EventCategory categoria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventStatus statusEvento;

    @Column(precision = 12, scale = 2)
    private BigDecimal valorTotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal valorPago;

    private Integer preReservaValidadeDias;

    @Column(nullable = false)
    private boolean contratoGerado;

    @Column(columnDefinition = "text")
    private String dadosContrato;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

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

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }
}
