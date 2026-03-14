package com.projeto.sistema_castracao_faesb.repository;

import com.projeto.sistema_castracao_faesb.dto.FluxoFinanceiroDTO;
import com.projeto.sistema_castracao_faesb.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    // --- 1. QUERIES DE DASHBOARD (Soma e Fluxo Financeiro) ---

    // Ajustado para retornar BigDecimal, garantindo precisão financeira
    @Query("SELECT COALESCE(SUM(p.valorContribuicao), 0) FROM Pagamento p WHERE p.confirmado = true")
    BigDecimal sumAprovados();

    /**
     * Busca o fluxo mensal.
     * CAST para BigDecimal garante que o gráfico do React receba valores precisos.
     */
    @Query("SELECT new com.projeto.sistema_castracao_faesb.dto.FluxoFinanceiroDTO(" +
            "CAST(FUNCTION('TO_CHAR', p.cadastro.dataSolicitacao, 'Mon') AS string), " +
            "CAST(SUM(CASE WHEN p.confirmado = true THEN p.valorContribuicao ELSE 0 END) AS BigDecimal), " +
            "CAST(SUM(CASE WHEN p.confirmado = false THEN p.valorContribuicao ELSE 0 END) AS BigDecimal)) " +
            "FROM Pagamento p " +
            "GROUP BY FUNCTION('TO_CHAR', p.cadastro.dataSolicitacao, 'Mon'), " +
            "EXTRACT(MONTH FROM p.cadastro.dataSolicitacao) " +
            "ORDER BY EXTRACT(MONTH FROM p.cadastro.dataSolicitacao) ASC")
    List<FluxoFinanceiroDTO> findFluxoFinanceiroMensal();

    // --- 2. QUERIES DE ALARMES E AUDITORIA ---

    @Query("SELECT p FROM Pagamento p WHERE p.confirmado = true AND p.dataConfirmacao >= :inicioDia")
    List<Pagamento> findAprovadosHoje(@Param("inicioDia") LocalDateTime inicioDia);

    @Query("SELECT COUNT(p) FROM Pagamento p WHERE p.confirmado = false AND p.cadastro.dataSolicitacao <= :dataLimite")
    long countAlertasCriticos(@Param("dataLimite") LocalDateTime dataLimite);

    @Query("SELECT p FROM Pagamento p WHERE p.confirmado = false AND p.cadastro.dataSolicitacao <= :dataLimite")
    List<Pagamento> findAlertasCriticos(@Param("dataLimite") LocalDateTime dataLimite);

    // --- 3. QUERIES DE EXTRATO (Histórico de Vida) ---

    List<Pagamento> findByConfirmadoTrueOrderByDataConfirmacaoDesc();

    // Busca pagamentos aprovados por um administrador específico
    List<Pagamento> findByAprovadoPorIdAndConfirmadoTrue(Long voluntarioId);

    // Busca pagamentos que caíram em uma conta PIX específica
    List<Pagamento> findByContaDestinoIdAndConfirmadoTrue(Long pixId);

    // --- 4. CONSULTAS BÁSICAS E PENDÊNCIAS ---

    List<Pagamento> findByConfirmadoFalse();

    long countByConfirmadoFalse();
}