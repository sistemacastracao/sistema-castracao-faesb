package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.dto.DashboardSummaryDTO;
import com.projeto.sistema_castracao_faesb.dto.EspecieDTO;
import com.projeto.sistema_castracao_faesb.dto.FluxoFinanceiroDTO;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import com.projeto.sistema_castracao_faesb.repository.CadastroCastracaoRepository;
import com.projeto.sistema_castracao_faesb.repository.PagamentoRepository;
import com.projeto.sistema_castracao_faesb.repository.PetRepository;
import com.projeto.sistema_castracao_faesb.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    @Autowired private PetRepository petRepository;
    @Autowired private TutorRepository tutorRepository;
    @Autowired private PagamentoRepository pagamentoRepository;
    @Autowired private CadastroCastracaoRepository cadastroRepository;

    public DashboardSummaryDTO getResumoCompleto() {
        // 1. Contagens Básicas
        long totalPets = petRepository.count();
        long tutoresAtivos = tutorRepository.count();

        // 2. Financeiro (Agora usando BigDecimal)
        BigDecimal arrecadacao = pagamentoRepository.sumAprovados();
        if (arrecadacao == null) {
            arrecadacao = BigDecimal.ZERO;
        }

        // 3. Status do Processo Lite
        long aguardando = cadastroRepository.countByStatusProcesso(StatusProcesso.AGUARDANDO_CONFERENCIA);
        long aprovados = cadastroRepository.countByStatusProcesso(StatusProcesso.PAGAMENTO_CONFIRMADO);

        // 4. Listas para Gráficos (Certifique-se que o FluxoFinanceiroDTO também usa BigDecimal)
        List<FluxoFinanceiroDTO> fluxo = pagamentoRepository.findFluxoFinanceiroMensal();
        List<EspecieDTO> especies = petRepository.findEspeciesCount();

        // RETORNO: O tipo de 'arrecadacao' agora bate com o Record
        return new DashboardSummaryDTO(
                totalPets,
                tutoresAtivos,
                arrecadacao,        // BigDecimal
                aguardando,
                aprovados,
                fluxo,
                especies
        );
    }
}