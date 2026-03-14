package com.projeto.sistema_castracao_faesb.repository;

import com.projeto.sistema_castracao_faesb.model.SistemaConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SistemaConfigRepository extends JpaRepository<SistemaConfig, Long> {
}