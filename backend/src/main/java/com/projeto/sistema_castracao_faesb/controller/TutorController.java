package com.projeto.sistema_castracao_faesb.controller;

import com.projeto.sistema_castracao_faesb.dto.TutorDTO;
import com.projeto.sistema_castracao_faesb.model.Tutor;
import com.projeto.sistema_castracao_faesb.service.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tutores")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    /**
     * Endpoint para consulta de Auditoria Interna (Painel Administrativo FAESB)
     */
    @GetMapping("/{id}")
    public ResponseEntity<TutorDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tutorService.buscarPorId(id));
    }

    /**
     * Endpoint para consulta de Histórico Geral via CPF
     */
    @GetMapping("/historico/{cpf}")
    public ResponseEntity<Tutor> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(tutorService.buscarPorCpf(cpf));
    }

    /**
     * ENGENHARIA REVERSA: Consulta para preenchimento automático no formulário de cadastro.
     * Se o CPF já existir na base do Polo, o React recebe os dados e "puxa" o alarme visual.
     */
    @GetMapping("/consultar/{cpf}")
    public ResponseEntity<Tutor> consultarParaCadastro(@PathVariable String cpf) {
        return tutorService.consultarParaCadastro(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * VALIDAÇÃO DE SEGURANÇA: Verifica se o e-mail informado já pertence a outro CPF.
     * Vital para evitar duplicidade de cadastros no Polo Tatuí.
     */
    @GetMapping("/verificar-email")
    public ResponseEntity<Map<String, Object>> verificarEmail(@RequestParam String email) {
        return tutorService.buscarPorEmail(email)
                .map(tutor -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("exists", true);
                    response.put("cpfOwner", tutor.getCpf());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("exists", false);
                    return ResponseEntity.ok(response);
                });
    }
}