package com.projeto.sistema_castracao_faesb.config;

import com.projeto.sistema_castracao_faesb.model.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class RouteFinder {

    /**
     * Pega o Enum Role e devolve a String da rota.
     * Se houver algum problema, ele joga para o painel por segurança.
     */
    public String obterRotaInicial(Role role) {
        if (role == null) return "/admin/login";
        return role.getRotaInicial();
    }
}