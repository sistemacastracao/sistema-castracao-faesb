package com.projeto.sistema_castracao_faesb.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.projeto.sistema_castracao_faesb.dto.DashboardSummaryDTO;
import com.projeto.sistema_castracao_faesb.model.*;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import com.projeto.sistema_castracao_faesb.repository.CadastroCastracaoRepository;
import com.projeto.sistema_castracao_faesb.repository.PagamentoRepository;
import com.projeto.sistema_castracao_faesb.repository.TutorRepository;
import com.projeto.sistema_castracao_faesb.service.AlarmeService;
import com.projeto.sistema_castracao_faesb.service.DashboardService;
import com.projeto.sistema_castracao_faesb.service.PagamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private PagamentoRepository pagamentoRepository;
    @Autowired private TutorRepository tutorRepository;
    @Autowired private AlarmeService alarmeService;
    @Autowired private DashboardService dashboardService;
    @Autowired private CadastroCastracaoRepository cadastroRepository;
    @Autowired private Cloudinary cloudinary;
    @Autowired private PagamentoService pagamentoService;

    @GetMapping("/pagamentos/pendentes")
    public List<Pagamento> listarPendentes() {
        return pagamentoService.listarPendentes();
    }

    /**
     * FILA MESTRA: Retorna todos os animais que já pagaram ou que já passaram por triagem.
     * Isso alimenta as abas Triagem e Cirurgia no Front-end.
     */
    @GetMapping("/fila-espera")
    public List<CadastroCastracao> listarFilaMestra() {
        // Buscamos todos os animais que estão nos estados que interessam ao Polo
        return cadastroRepository.findByStatusProcessoIn(Arrays.asList(
                StatusProcesso.PAGAMENTO_CONFIRMADO
        ));
    }

    @PatchMapping("/pagamentos/{id}/aprovar")
    public ResponseEntity<Void> aprovarPagamento(@PathVariable Long id, Authentication authentication) {
        String emailLogado = (authentication.getPrincipal() instanceof Administrador)
                ? ((Administrador) authentication.getPrincipal()).getEmail()
                : authentication.getName();

        pagamentoService.confirmarPagamento(id, emailLogado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pagamentos/extrato")
    public ResponseEntity<List<Pagamento>> buscarExtratoCompleto() {
        return ResponseEntity.ok(pagamentoService.listarExtratoAuditoria());
    }

    @PatchMapping("/pagamentos/{id}/rejeitar")
    public ResponseEntity<Void> rejeitarPagamento(@PathVariable Long id) {
        pagamentoService.rejeitarERemoverTudo(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/tutores")
    public List<Tutor> listarTutores(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return tutorRepository.findByNomeContainingIgnoreCase(search);
        }
        return tutorRepository.findAll();
    }

    @GetMapping("/alarmes")
    public List<Map<String, String>> buscarAlarmes() {
        return alarmeService.gerarRelatorioAlarmes();
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getResumoCompleto());
    }

    @PostMapping("/pagamentos/upload-comprovante")
    public ResponseEntity<?> uploadComprovante(@RequestParam("file") MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "faesb_comprovantes"));
            return ResponseEntity.ok(Map.of("url", uploadResult.get("secure_url").toString()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erro ao subir arquivo para a nuvem FAESB");
        }
    }
}