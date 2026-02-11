package com.dimarcos.backend.dto;

import java.math.BigDecimal;

public class CashSummaryResponse {

    private BigDecimal entrada;
    private BigDecimal saida;
    private BigDecimal total;
    private BigDecimal disponivel;

    public CashSummaryResponse(BigDecimal entrada, BigDecimal saida) {
        this.entrada = entrada;
        this.saida = saida;
        this.total = entrada.subtract(saida);
        this.disponivel = this.total;
    }

    public BigDecimal getEntrada() {
        return entrada;
    }

    public BigDecimal getSaida() {
        return saida;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getDisponivel() {
        return disponivel;
    }
}
