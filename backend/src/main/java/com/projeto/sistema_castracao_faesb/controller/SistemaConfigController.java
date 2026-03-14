package com.projeto.sistema_castracao_faesb.controller;

import com.projeto.sistema_castracao_faesb.model.SistemaConfig;
import com.projeto.sistema_castracao_faesb.service.SistemaConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sistema")
public class SistemaConfigController {

    @Autowired
    private SistemaConfigService service;

    /**
     * ROTA PÚBLICA: Usada pelo React para saber se deve exibir o formulário.
     * Se o Polo FAESB estiver com as vagas lotadas, o Front bloqueia o botão de cadastro.
     */
    @GetMapping("/status")
    public ResponseEntity<SistemaConfig> getStatusPublico() {
        return ResponseEntity.ok(service.getConfig());
    }

    /**
     * ROTA MASTER: O Administrador Master decide se abre ou fecha as inscrições.
     * Ajustado para ROLE_MASTER conforme o padrão de segurança FAESB.
     */
    @PreAuthorize("hasAuthority('ROLE_MASTER')")
    @PatchMapping("/admin/toggle")
    public ResponseEntity<SistemaConfig> toggleStatus(@RequestBody Map<String, Boolean> payload) {
        // Garante que o payload não venha vazio para evitar erros
        Boolean novoStatus = payload.getOrDefault("aberto", false);
        return ResponseEntity.ok(service.toggleCadastro(novoStatus));
    }
}