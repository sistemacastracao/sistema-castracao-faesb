package com.projeto.sistema_castracao_faesb.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryDTO(
        long totalPets,
        long tutoresAtivos,
        BigDecimal arrecadacaoTotal, // Alterado para BigDecimal
        long aguardandoConfirmacao,
        long pagamentosAprovados,
        List<FluxoFinanceiroDTO> fluxoFinanceiro,
        List<EspecieDTO> distribuicaoEspecies
) {}