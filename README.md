# Sistema de Gerenciamento de Eventos

Aplicação full stack para gestão operacional de uma empresa de eventos, com foco em agenda de visitas e festas, controle de clientes, financeiro (entradas/saídas/reembolsos), histórico de pagamentos e autenticação por perfis.

---

## Visão Geral

O projeto foi desenvolvido para centralizar o fluxo de trabalho de uma operação de eventos em um único sistema, permitindo:

- organizar agenda de visitas e festas;
- cadastrar e manter clientes;
- registrar pagamentos, despesas e reembolsos;
- acompanhar indicadores rápidos no dashboard;
- controlar acesso por perfil de usuário (admin, financeiro e atendente).

A solução é composta por:

- **Backend**: Java 17 + Spring Boot + Spring Security + JPA + Flyway + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Material UI

---

## Funcionalidades

### 1) Autenticação e autorização
- Login com emissão de token JWT.
- Cadastro de usuário.
- Controle de permissões por papel (`ADMIN`, `FINANCEIRO`, `ATENDENTE`).
- Rotas protegidas no frontend com redirecionamento para login em caso de token inválido/expirado.

### 2) Gestão de clientes
- Cadastro, edição, listagem, consulta por ID e exclusão.
- Busca por termo (nome, telefone ou CPF).
- Validação para impedir CPF duplicado.

### 3) Gestão de eventos (visitas e festas)
- Criação de visitas.
- Criação de festas.
- Atualização de eventos.
- Conversão de visita em festa.
- Cancelamento com registro de reembolso.
- Filtros por tipo, status e período.
- Validação de conflito de agenda para evitar duas festas no mesmo horário.

### 4) Módulo financeiro (caixa)
- Registro de entradas vinculadas a eventos.
- Registro de despesas.
- Registro de reembolsos.
- Listagem de lançamentos por período.
- Resumo financeiro consolidado (entradas, saídas e saldo).

### 5) Histórico de pagamentos
- Consulta do histórico por cliente, evento e período.
- Rastreabilidade de pagamentos e reembolsos.

### 6) Dashboard operacional
- Indicadores rápidos de:
  - contratos pendentes,
  - agenda de festas,
  - agenda de visitas,
  - eventos cancelados.

---

## Arquitetura do Backend

Estrutura orientada a camadas para facilitar manutenção e evolução:

- **controller**: exposição dos endpoints REST.
- **dto**: contratos de entrada/saída da API.
- **service**: regras de negócio e orquestração.
- **repository**: acesso ao banco com Spring Data JPA.
- **domain**: entidades e enums persistidos.
- **config/security**: autenticação JWT e políticas de acesso.
- **exception**: tratamento global e padronizado de erros.

---

## Tecnologias

### Backend
- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (jjwt)
- Flyway
- PostgreSQL
- Springdoc OpenAPI (Swagger UI)
- JUnit + Mockito

### Frontend
- React 18
- TypeScript
- Vite
- Material UI
- Axios
- React Router DOM

---

## Estrutura do Projeto

```bash
.
├── backend
│   ├── src/main/java/com/dimarcos/backend
│   │   ├── config/security
│   │   ├── controller
│   │   ├── domain
│   │   ├── dto
│   │   ├── exception
│   │   ├── repository
│   │   └── service
│   └── src/main/resources
│       ├── application.yml
│       └── db/migration
├── frontend
│   └── src
│       ├── api
│       ├── auth
│       ├── components
│       ├── layouts
│       └── pages
└── docker-compose.yml
