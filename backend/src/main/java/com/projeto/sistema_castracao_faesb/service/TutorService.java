package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.dto.TutorDTO;
import com.projeto.sistema_castracao_faesb.model.Tutor;
import com.projeto.sistema_castracao_faesb.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    public TutorDTO buscarPorId(Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutor não encontrado"));
        return new TutorDTO(tutor);
    }

    public Tutor buscarPorCpf(String cpf) {
        // Limpa o CPF antes de buscar para garantir que o SELECT use apenas números
        String cpfLimpo = (cpf != null) ? cpf.replaceAll("\\D", "") : "";
        return tutorRepository.findByCpf(cpfLimpo)
                .orElseThrow(() -> new RuntimeException("Nenhum histórico encontrado para o CPF: " + cpfLimpo));
    }

    // --- MÉTODO CORRIGIDO ---
    public Optional<Tutor> consultarParaCadastro(String cpfRecebido) {
        if (cpfRecebido == null || cpfRecebido.isEmpty()) return Optional.empty();

        // 1. Remove TUDO que não for número (pontos, traços, espaços)
        String apenasNumeros = cpfRecebido.replaceAll("\\D", "");

        // 2. BUSCA DIRETA: O banco só tem números, então perguntamos só por números.
        // Se o banco tem '30968204813', e apenasNumeros for '30968204813', agora ele ENCONTRA.
        return tutorRepository.findByCpf(apenasNumeros);
    }

    public Optional<Tutor> buscarPorEmail(String email) {
        return tutorRepository.findByEmail(email);
    }
}