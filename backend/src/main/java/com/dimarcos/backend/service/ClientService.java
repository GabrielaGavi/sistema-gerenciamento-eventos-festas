package com.dimarcos.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dimarcos.backend.domain.Client;
import com.dimarcos.backend.dto.ClientRequest;
import com.dimarcos.backend.exception.BusinessException;
import com.dimarcos.backend.exception.ResourceNotFoundException;
import com.dimarcos.backend.repository.ClientRepository;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> list(String termo) {
        if (termo == null || termo.isBlank()) {
            return clientRepository.findAll();
        }
        return clientRepository.findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCaseOrCpfContainingIgnoreCase(
            termo,
            termo,
            termo
        );
    }

    public Client get(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado"));
    }

    @Transactional
    public Client create(ClientRequest request) {
        if (clientRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException("CPF ja cadastrado");
        }
        Client client = new Client();
        apply(client, request);
        return clientRepository.save(client);
    }

    @Transactional
    public Client update(Long id, ClientRequest request) {
        Client client = get(id);
        if (!client.getCpf().equals(request.getCpf()) && clientRepository.existsByCpf(request.getCpf())) {
            throw new BusinessException("CPF ja cadastrado");
        }
        apply(client, request);
        return clientRepository.save(client);
    }

    @Transactional
    public void delete(Long id) {
        Client client = get(id);
        clientRepository.delete(client);
    }

    private void apply(Client client, ClientRequest request) {
        client.setNome(request.getNome());
        client.setEmail(request.getEmail());
        client.setTelefone(request.getTelefone());
        client.setCpf(request.getCpf());
        client.setEndereco(request.getEndereco());
    }
}
