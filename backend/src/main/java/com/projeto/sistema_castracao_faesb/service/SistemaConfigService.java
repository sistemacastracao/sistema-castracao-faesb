package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.SistemaConfig;
import com.projeto.sistema_castracao_faesb.repository.SistemaConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SistemaConfigService {
    @Autowired
    private SistemaConfigRepository repository;

    public SistemaConfig getConfig() {
        return repository.findById(1L).orElseGet(() -> {
            SistemaConfig nova = new SistemaConfig();
            return repository.save(nova);
        });
    }

    public SistemaConfig toggleCadastro(boolean status) {
        SistemaConfig config = getConfig();
        config.setCadastroAberto(status);
        return repository.save(config);
    }
}