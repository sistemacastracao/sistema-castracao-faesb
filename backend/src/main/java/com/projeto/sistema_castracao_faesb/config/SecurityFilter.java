package com.projeto.sistema_castracao_faesb.config;

import com.projeto.sistema_castracao_faesb.repository.AdministradorRepository;
import com.projeto.sistema_castracao_faesb.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AdministradorRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. APENAS RECUPERA O TOKEN
        var token = recuperarToken(request);

        // 2. SE O TOKEN EXISTIR, TENTA AUTENTICAR
        if (token != null) {
            var email = tokenService.getSubject(token);

            if (email != null) {
                var administrador = repository.findByEmail(email).orElse(null);

                if (administrador != null && administrador.isAtivo()) {
                    String roleName = administrador.getNivelAcesso().name();

                    // DICA: O Spring prefere o padrão "ROLE_" + NOME
                    var authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + roleName)
                    );

                    var authentication = new UsernamePasswordAuthenticationToken(
                            administrador, null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    // Log para debug no console do Java
                    System.out.println("✅ USUÁRIO AUTENTICADO: " + email + " ROLE: " + roleName);
                }
            }
        }

        // 3. CONTINUA A REQUISIÇÃO (Se for login, o Spring verá que é permitAll e deixará passar)
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        // Tenta buscar no Cookie (Navegador/Produção)
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("accessToken")) {
                    return cookie.getValue();
                }
            }
        }

        // Tenta buscar no Header (Insomnia/Postman/Testes)
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }

        return null;
    }
}