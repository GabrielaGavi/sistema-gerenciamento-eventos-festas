package com.dimarcos.backend.dto;

import com.dimarcos.backend.domain.Client;
import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.PaymentHistory;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static ClientResponse toClientResponse(Client client) {
        ClientResponse response = new ClientResponse();
        response.setId(client.getId());
        response.setNome(client.getNome());
        response.setEmail(client.getEmail());
        response.setTelefone(client.getTelefone());
        response.setCpf(client.getCpf());
        response.setEndereco(client.getEndereco());
        response.setCreatedAt(client.getCreatedAt());
        response.setUpdatedAt(client.getUpdatedAt());
        return response;
    }

    public static EventResponse toEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTipoEvento(event.getTipoEvento());
        response.setDataHoraEvento(event.getDataHoraEvento());
        response.setDataHoraVisita(event.getDataHoraVisita());
        response.setCapacidade(event.getCapacidade());
        response.setCategoria(event.getCategoria());
        response.setStatusEvento(event.getStatusEvento());
        response.setValorTotal(event.getValorTotal());
        response.setValorPago(event.getValorPago());
        response.setPreReservaValidadeDias(event.getPreReservaValidadeDias());
        response.setContratoGerado(event.isContratoGerado());
        response.setDadosContrato(event.getDadosContrato());
        response.setClient(toClientResponse(event.getClient()));
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }

    public static PaymentHistoryResponse toPaymentHistoryResponse(PaymentHistory history) {
        PaymentHistoryResponse response = new PaymentHistoryResponse();
        response.setId(history.getId());
        response.setClientId(history.getClient().getId());
        response.setEventId(history.getEvent().getId());
        response.setValor(history.getValor());
        response.setData(history.getData());
        response.setTipo(history.getTipo());
        return response;
    }
}
