package com.dimarcos.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dimarcos.backend.domain.CashEntry;

public interface CashEntryRepository extends JpaRepository<CashEntry, Long> {

    List<CashEntry> findByDataBetween(LocalDateTime from, LocalDateTime to);

    @Query("""
        select coalesce(sum(case when c.operacao = 'ENTRADA' then c.valor else 0 end), 0),
               coalesce(sum(case when c.operacao = 'SAIDA' then c.valor else 0 end), 0)
        from CashEntry c
        where c.data >= coalesce(:from, c.data)
          and c.data <= coalesce(:to, c.data)
        """)
    Object[] sumEntriesAndExits(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
