package com.dimarcos.backend.dto;

import java.time.LocalDateTime;

import com.dimarcos.backend.domain.enums.EventCategory;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class EventVisitRequest {

    private Long clientId;

    @Valid
    private ClientRequest client;

    @NotNull
    private LocalDateTime dataHoraVisita;

    private LocalDateTime dataHoraEventoPretendida;

    private EventCategory categoria;

    private Integer capacidade;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public ClientRequest getClient() {
        return client;
    }

    public void setClient(ClientRequest client) {
        this.client = client;
    }

    public LocalDateTime getDataHoraVisita() {
        return dataHoraVisita;
    }

    public void setDataHoraVisita(LocalDateTime dataHoraVisita) {
        this.dataHoraVisita = dataHoraVisita;
    }

    public LocalDateTime getDataHoraEventoPretendida() {
        return dataHoraEventoPretendida;
    }

    public void setDataHoraEventoPretendida(LocalDateTime dataHoraEventoPretendida) {
        this.dataHoraEventoPretendida = dataHoraEventoPretendida;
    }

    public EventCategory getCategoria() {
        return categoria;
    }

    public void setCategoria(EventCategory categoria) {
        this.categoria = categoria;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }
}
