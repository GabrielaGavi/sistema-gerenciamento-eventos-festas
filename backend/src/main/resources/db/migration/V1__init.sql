create table users (
    id bigserial primary key,
    username varchar(50) not null unique,
    password_hash varchar(255) not null,
    role varchar(20) not null,
    active boolean not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table clients (
    id bigserial primary key,
    nome varchar(120) not null,
    email varchar(120) not null,
    telefone varchar(40) not null,
    cpf varchar(20) not null unique,
    endereco varchar(255) not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table events (
    id bigserial primary key,
    tipo_evento varchar(20) not null,
    data_hora_evento timestamp,
    data_hora_visita timestamp,
    capacidade integer,
    categoria varchar(30),
    status_evento varchar(20) not null,
    valor_total numeric(12, 2),
    valor_pago numeric(12, 2),
    pre_reserva_validade_dias integer,
    contrato_gerado boolean not null,
    dados_contrato text,
    client_id bigint not null references clients(id),
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_events_data_hora_evento on events(data_hora_evento);
create index idx_events_data_hora_visita on events(data_hora_visita);
create index idx_events_status_evento on events(status_evento);

create table payment_history (
    id bigserial primary key,
    client_id bigint not null references clients(id),
    event_id bigint not null references events(id),
    valor numeric(12, 2) not null,
    data timestamp not null,
    tipo varchar(20) not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_payment_history_data on payment_history(data);

create table cash_entries (
    id bigserial primary key,
    data timestamp not null,
    forma_pagamento varchar(20) not null,
    operacao varchar(10) not null,
    tipo varchar(20) not null,
    valor numeric(12, 2) not null,
    observacao varchar(255),
    event_id bigint references events(id),
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_cash_entries_data on cash_entries(data);
