package com.projeto.sistema_castracao_faesb.controller;

import com.projeto.sistema_castracao_faesb.dto.LoginDTO;
import com.projeto.sistema_castracao_faesb.dto.LoginResponseDTO;
import com.projeto.sistema_castracao_faesb.model.Administrador;
import com.projeto.sistema_castracao_faesb.repository.AdministradorRepository;
import com.projeto.sistema_castracao_faesb.service.AutenticacaoService;
import com.projeto.sistema_castracao_faesb.service.TokenService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    @Autowired
    private AutenticacaoService autenticacaoService;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private TokenService tokenService;

    // Lendo a propriedade de ambiente (dev ou prod)
    @Value("${api.security.env:prod}")
    private String env;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dados, HttpServletResponse response) {
        try {
            // 1. O service valida e já traz o DTO completo (com a rota que criamos!)
            LoginResponseDTO loginResponse = autenticacaoService.validarLogin(dados);

            // 2. Otimização: Buscamos o admin apenas para gerar o token.
            // Dica: Se quiser ser ainda mais pro, o validarLogin poderia retornar um objeto
            // contendo tanto o DTO quanto o Token, mas assim já está ótimo!
            Administrador admin = administradorRepository.findById(loginResponse.id())
                    .orElseThrow(() -> new RuntimeException("Erro ao processar login."));

            String token = tokenService.gerarToken(admin);

            // 3. Configuração do Cookie (Mantendo sua lógica inteligente de env)
            boolean isProd = "prod".equalsIgnoreCase(env);
            ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(true)
                    .secure(isProd)
                    .path("/")
                    .maxAge(24 * 60 * 60) // 24 horas
                    .sameSite(isProd ? "None" : "Lax")
                    .build();

            // 4. Retorno para o React ler: userData = response.data.user
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of("user", loginResponse));

        } catch (Exception e) {
            // 401 para credenciais inválidas, seguindo o padrão REST
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        boolean isProd = "prod".equalsIgnoreCase(env);

        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(isProd)
                .path("/")
                .maxAge(0)
                .sameSite(isProd ? "None" : "Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logout realizado com sucesso"));
    }
}