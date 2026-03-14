package com.projeto.sistema_castracao_faesb.controller;

import com.projeto.sistema_castracao_faesb.dto.CadastroPetRecordDTO;
import com.projeto.sistema_castracao_faesb.service.CadastroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/cadastros")
public class CadastroController {

    @Autowired
    private CadastroService cadastroService;


    /**
     * CADASTRO OFICIAL: Recebe o formulário e o comprovante PIX.
     * Consome multipart/form-data para processar o upload para o Cloudinary via Service.
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> cadastrar(
            @RequestPart("dados") CadastroPetRecordDTO dados,
            @RequestPart("arquivo") MultipartFile arquivo) {
        try {
            cadastroService.cadastrar(dados, arquivo);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensagem", "Cadastro realizado com sucesso!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String novoStatus = body.get("status");
            cadastroService.atualizarStatusProcesso(id, novoStatus);
            return ResponseEntity.ok(Map.of("mensagem", "Status atualizado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", "Erro ao atualizar status: " + e.getMessage()));
        }
    }
}