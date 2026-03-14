package com.projeto.sistema_castracao_faesb.dto;

import com.projeto.sistema_castracao_faesb.model.enums.Role;

public record LoginResponseDTO(
        Long id,
        String nome,
        String email,
        Role nivelAcesso,           // Isso enviará "MASTER" no JSON
        String rotaInicial   // Isso enviará "/admin/painel" no JSON
) {}