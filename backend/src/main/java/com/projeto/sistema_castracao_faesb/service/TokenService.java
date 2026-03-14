package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.Administrador;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    private final String SECRET_KEY = "SuaChaveSuperSecretaParaASegurancaDaOngTatuí2026";
    private final long EXPIRATION_TIME = 86400000; // 24 horas

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String gerarToken(Administrador admin) {
        return Jwts.builder()
                .setSubject(admin.getEmail())
                .claim("id", admin.getId())
                .claim("nome", admin.getNome())
                .claim("role", admin.getNivelAcesso().name()) // Aqui salva como "VETERINARIA"
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getSubject(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            System.err.println("❌ Erro ao validar subject do token: " + e.getMessage());
            return null;
        }
    }
}