package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.ConfiguracaoPix;
import com.projeto.sistema_castracao_faesb.repository.ConfiguracaoPixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConfiguracaoPixService {

    @Autowired
    private ConfiguracaoPixRepository repository;

    /**
     * SALVAR NOVA CHAVE:
     * O Master decide a chave, o banco e o VALOR da taxa.
     */
    @Transactional
    public ConfiguracaoPix salvarNovaChave(ConfiguracaoPix novaChave) {
        // 1. Desativa as configurações anteriores (só pode haver uma ativa)
        repository.desativarTodasAsChaves();

        // 2. Define o status e o carimbo de tempo (para o Alarme de 24h)
        novaChave.setAtivo(true);
        novaChave.setDataCriacao(LocalDateTime.now());

        // 3. Validação básica: O valor vem do que o Master digitou no Front-end
        if (novaChave.getValorTaxa() == null) {
            throw new RuntimeException("O valor da taxa deve ser definido pelo administrador.");
        }

        // 4. Salva a nova configuração (Chave + Valor decidido pela FAESB)
        return repository.save(novaChave);
    }

    public ConfiguracaoPix buscarChaveAtiva() {
        return repository.findByAtivoTrue()
                .orElseThrow(() -> new RuntimeException("Nenhuma configuração ativa no Polo."));
    }

    public List<ConfiguracaoPix> listarTodasAsChaves() {
        return repository.findAll();
    }
}