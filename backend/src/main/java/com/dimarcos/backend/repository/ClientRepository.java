package com.dimarcos.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dimarcos.backend.domain.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {

    List<Client> findByNomeContainingIgnoreCaseOrTelefoneContainingIgnoreCaseOrCpfContainingIgnoreCase(
        String nome,
        String telefone,
        String cpf
    );

    boolean existsByCpf(String cpf);
}
