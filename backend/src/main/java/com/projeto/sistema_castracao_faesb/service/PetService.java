package com.projeto.sistema_castracao_faesb.service;

import com.projeto.sistema_castracao_faesb.model.CadastroCastracao;
import com.projeto.sistema_castracao_faesb.model.Pet;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import com.projeto.sistema_castracao_faesb.repository.CadastroCastracaoRepository;
import com.projeto.sistema_castracao_faesb.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private CadastroCastracaoRepository cadastroRepository; // Ajustado aqui

    public List<Pet> listarConfirmados() {
        // Busca os cadastros que já passaram pela conferência do Master
        List<CadastroCastracao> cadastrosNaFila = cadastroRepository.findByStatusProcesso(StatusProcesso.PAGAMENTO_CONFIRMADO);

        return cadastrosNaFila.stream()
                .map(CadastroCastracao::getPet)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Pet> listarTodos() {
        return petRepository.findAll();
    }

    public List<Pet> buscarPorTutor(String cpf) {
        return petRepository.findByTutorCpf(cpf);
    }

    public Pet buscarPorId(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet não encontrado com o ID: " + id));
    }
}