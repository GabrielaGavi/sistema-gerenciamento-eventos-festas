package com.dimarcos.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dimarcos.backend.domain.Event;
import com.dimarcos.backend.domain.enums.EventStatus;
import com.dimarcos.backend.domain.enums.EventType;

public interface EventRepository extends JpaRepository<Event, Long> {

    boolean existsByTipoEventoAndDataHoraEventoAndStatusEventoNot(
        EventType tipoEvento,
        LocalDateTime dataHoraEvento,
        EventStatus statusEvento
    );

    boolean existsByTipoEventoAndDataHoraEventoAndStatusEventoNotAndIdNot(
        EventType tipoEvento,
        LocalDateTime dataHoraEvento,
        EventStatus statusEvento,
        Long id
    );

    List<Event> findByTipoEventoOrderByDataHoraEventoAsc(EventType tipoEvento);

    List<Event> findByTipoEventoOrderByDataHoraVisitaAsc(EventType tipoEvento);

    List<Event> findByContratoGeradoFalseAndStatusEventoIn(List<EventStatus> statuses);

    List<Event> findByStatusEvento(EventStatus statusEvento);

    @Query("""
        select e from Event e
        where (:tipo is null or e.tipoEvento = :tipo)
          and (:status is null or e.statusEvento = :status)
          and (
            :dataFrom is null
            or e.dataHoraEvento >= :dataFrom
            or e.dataHoraVisita >= :dataFrom
          )
          and (
            :dataTo is null
            or e.dataHoraEvento <= :dataTo
            or e.dataHoraVisita <= :dataTo
          )
        """)
    List<Event> findAllWithFilters(
        @Param("tipo") EventType tipo,
        @Param("status") EventStatus status,
        @Param("dataFrom") LocalDateTime dataFrom,
        @Param("dataTo") LocalDateTime dataTo
    );
}
