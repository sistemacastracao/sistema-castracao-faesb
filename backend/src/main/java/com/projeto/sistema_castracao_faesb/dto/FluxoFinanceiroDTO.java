package com.projeto.sistema_castracao_faesb.dto;

import java.math.BigDecimal;

public record FluxoFinanceiroDTO(
        String mes,
        BigDecimal totalAprovado,
        BigDecimal totalPendente
) {}