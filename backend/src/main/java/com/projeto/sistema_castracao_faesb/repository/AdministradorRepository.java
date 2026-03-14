package com.projeto.sistema_castracao_faesb.repository;

import com.projeto.sistema_castracao_faesb.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
}