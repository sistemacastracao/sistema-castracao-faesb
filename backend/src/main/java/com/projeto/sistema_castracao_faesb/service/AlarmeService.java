package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.ConfiguracaoPix;
import com.projeto.sistema_castracao_faesb.model.Pagamento;
import com.projeto.sistema_castracao_faesb.repository.ConfiguracaoPixRepository;
import com.projeto.sistema_castracao_faesb.repository.PagamentoRepository;
import com.projeto.sistema_castracao_faesb.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AlarmeService {

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ConfiguracaoPixRepository pixRepository;

    public List<Map<String, String>> gerarRelatorioAlarmes() {
        List<Map<String, String>> alarmes = new ArrayList<>();

        // 1. REGRA FINANCEIRA (FILA PARADA)
        // Mantido: Se o pagamento foi feito mas o pet está parado há 15 dias sem agendar.
        LocalDateTime dataLimite = LocalDateTime.now().minusDays(15);
        long pendentesCriticos = pagamentoRepository.countAlertasCriticos(dataLimite);
        if (pendentesCriticos > 0) {
            alarmes.add(criarAlarme("CRÍTICO", pendentesCriticos + " cadastros aguardando agendamento há +15 dias no Polo", "ALTA", "Coordenação"));
        }

        // 2. REGRA OPERACIONAL
        // Alerta de volume de animais na fila do Polo FAESB.
        long naFila = petRepository.countByStatusFila();
        if (naFila > 5) {
            alarmes.add(criarAlarme("OPERACIONAL", "Fila do Polo: " + naFila + " pets aguardando agendamento", "MEDIA", "Logística"));
        }

        // 3. REGRA: ALERTA DE PIX ALTERADO (ESTE SOME EM 24H)
        LocalDateTime limite24Horas = LocalDateTime.now().minusHours(24);

        // Esta busca garante que se a alteração for mais antiga que 24h, o alerta desaparece.
        Optional<ConfiguracaoPix> pixAlteradoNasUltimas24h = pixRepository.findTopByDataCriacaoAfterOrderByDataCriacaoDesc(limite24Horas);

        if (pixAlteradoNasUltimas24h.isPresent()) {
            alarmes.add(criarAlarme(
                    "AUDITORIA",
                    "⚠️ A conta PIX (R$ 60,00) foi alterada recentemente! Verifique a segurança Master.",
                    "ALTA",
                    "Segurança Master"
            ));
        }

        // 4. REGRA: RESUMO DE PRODUTIVIDADE
        LocalDateTime inicioHoje = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        List<Pagamento> aprovadosHoje = pagamentoRepository.findAprovadosHoje(inicioHoje);

        if (aprovadosHoje != null && !aprovadosHoje.isEmpty()) {
            alarmes.add(criarAlarme(
                    "AUDITORIA",
                    "Hoje foram confirmadas " + aprovadosHoje.size() + " castrações no Polo Tatuí.",
                    "INFO",
                    "Ver no Extrato"
            ));
        }

        return alarmes;
    }

    private Map<String, String> criarAlarme(String tipo, String mensagem, String prioridade, String responsavel) {
        Map<String, String> alarme = new HashMap<>();
        alarme.put("tipo", tipo);
        alarme.put("mensagem", mensagem);
        alarme.put("prioridade", prioridade);
        alarme.put("responsavel", responsavel);
        return alarme;
    }
}