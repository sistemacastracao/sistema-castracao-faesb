package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.*;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import com.projeto.sistema_castracao_faesb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PagamentoService {

    @Autowired private PagamentoRepository pagamentoRepository;
    @Autowired private EmailService emailService;
    @Autowired private CadastroCastracaoRepository cadastroRepository;
    @Autowired private PetRepository petRepository;
    @Autowired private TutorRepository tutorRepository;
    @Autowired private AdministradorRepository adminRepository;
    @Autowired private ConfiguracaoPixService pixService;

    @Transactional
    public void confirmarPagamento(Long pagamentoId, String emailMaster) {
        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        ConfiguracaoPix pixAtivo = pixService.buscarChaveAtiva();
        CadastroCastracao cadastro = pagamento.getCadastro();

        pagamento.setConfirmado(true);
        pagamento.setDataConfirmacao(LocalDateTime.now());
        pagamento.setContaDestino(pixAtivo);

        // AUDITORIA: Registra quem do Polo FAESB validou este PIX
        adminRepository.findByEmail(emailMaster.trim().toLowerCase())
                .ifPresentOrElse(
                        admin -> pagamento.setAprovadorNome(admin.getNome()),
                        () -> {
                            if ("sistemacastracao@gmail.com".equalsIgnoreCase(emailMaster)) {
                                // Ajustado para nome institucional do Polo
                                pagamento.setAprovadorNome("Sistema Polo FAESB");
                            } else {
                                pagamento.setAprovadorNome("Polo FAESB (Automático)");
                            }
                        }
                );

        // Captura o valor da taxa que o Master decidiu (R$ 60,00 ou o valor atual)
        if (pixAtivo.getValorTaxa() != null) {
            pagamento.setValorContribuicao(pixAtivo.getValorTaxa());
        }

        // PET NA FILA: Muda o status para o munícipe poder ser agendado
        cadastro.setStatusProcesso(StatusProcesso.PAGAMENTO_CONFIRMADO);

        pagamentoRepository.save(pagamento);
        cadastroRepository.save(cadastro);

        try {
            emailService.enviarConfirmacaoPagamento(cadastro.getTutor().getEmail(), cadastro.getPet().getNomeAnimal());
        } catch (Exception e) {
            System.err.println("Aviso: Falha ao enviar e-mail de confirmação para " + cadastro.getTutor().getEmail());
        }
    }

    @Transactional
    public void rejeitarERemoverTudo(Long pagamentoId) {
        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() -> new RuntimeException("Pagamento não encontrado"));

        CadastroCastracao cadastro = pagamento.getCadastro();
        Tutor tutor = (cadastro != null) ? cadastro.getTutor() : null;
        Pet pet = (cadastro != null) ? cadastro.getPet() : null;

        // Notifica o munícipe sobre a invalidação (Regra das 24h)
        if (tutor != null) {
            emailService.enviarEmailPagamentoNaoIdentificado(
                    tutor.getEmail(),
                    tutor.getNome(),
                    pet != null ? pet.getNomeAnimal() : "Animal",
                    "Comprovante PIX não identificado ou inválido para os critérios do Polo."
            );
        }

        // DELEÇÃO EM CASCATA MANUAL: Garante que não fiquem dados órfãos sem pagamento
        pagamentoRepository.delete(pagamento);

        if (cadastro != null) {
            cadastroRepository.delete(cadastro);

            if (pet != null) {
                // Remove o pet se este for o único processo dele
                petRepository.delete(pet);
            }

            // REGRA DE HISTÓRICO: Só apaga o tutor se ele não tiver outros animais castrados
            if (tutor != null) {
                List<CadastroCastracao> outrosProcessos = cadastroRepository.findByTutorId(tutor.getId());
                if (outrosProcessos.isEmpty()) {
                    tutorRepository.delete(tutor);
                }
            }
        }
    }

    public List<Pagamento> listarExtratoAuditoria() {
        return pagamentoRepository.findByConfirmadoTrueOrderByDataConfirmacaoDesc();
    }

    public List<Pagamento> listarPendentes() {
        return pagamentoRepository.findByConfirmadoFalse();
    }
}