package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.config.RouteFinder;
import com.projeto.sistema_castracao_faesb.dto.LoginDTO;
import com.projeto.sistema_castracao_faesb.dto.LoginResponseDTO;
import com.projeto.sistema_castracao_faesb.model.Administrador;
import com.projeto.sistema_castracao_faesb.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService {

    @Autowired
    private AdministradorRepository repository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Injetando o nosso novo localizador de rotas
    @Autowired
    private RouteFinder routeFinder;

    public LoginResponseDTO validarLogin(LoginDTO dados) {
        String emailLimpo = dados.email().trim().toLowerCase();
        String senhaLimpa = dados.senha().trim();

        // 1. Busca o admin
        Administrador admin = repository.findByEmail(emailLimpo)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos."));

        // 2. Verificações de Segurança
        if (!admin.isAtivo()) {
            throw new RuntimeException("Sua conta está desativada.");
        }

        if (!passwordEncoder.matches(senhaLimpa, admin.getSenha())) {
            throw new RuntimeException("E-mail ou senha incorretos.");
        }

        // --- 3. LÓGICA DE ROTA DINÂMICA ---
        // Pegamos a rota através do RouteFinder que usa o seu Enum Role
        String rotaInicial = routeFinder.obterRotaInicial(admin.getNivelAcesso());

        // --- 4. RETORNA O DTO COMPLETO PARA O REACT ---
        return new LoginResponseDTO(
                admin.getId(),
                admin.getNome(),
                admin.getEmail(),
                admin.getNivelAcesso(),    // Enviando o Enum (MASTER, etc)
                rotaInicial         // Enviando a String (/admin/painel)
        );
    }
}