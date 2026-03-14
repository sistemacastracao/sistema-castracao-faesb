package com.projeto.sistema_castracao_faesb.model.enums;

public enum Role {
    MASTER("/admin/painel"),
    VETERINARIA("/admin/clinico"); // Adicionei para testarmos a escalabilidade

    private final String rotaInicial;

    // Construtor do Enum
    Role(String rotaInicial) {
        this.rotaInicial = rotaInicial;
    }

    public String getRotaInicial() {
        return rotaInicial;
    }
}