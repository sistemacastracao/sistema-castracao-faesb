package com.projeto.sistema_castracao_faesb.repository;

import com.projeto.sistema_castracao_faesb.dto.EspecieDTO;
import com.projeto.sistema_castracao_faesb.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByTutorCpf(String cpf);

    /**
     * CORREÇÃO: O caminho do DTO agora aponta para o novo pacote FAESB.
     * Isso resolve o erro de 'Could not resolve class' no boot do IntelliJ.
     */
    @Query("SELECT new com.projeto.sistema_castracao_faesb.dto.EspecieDTO(p.especie, COUNT(p)) " +
            "FROM Pet p GROUP BY p.especie")
    List<EspecieDTO> findEspeciesCount();

    // Mantido seu JOIN manual que funciona na sua estrutura para a fila do Polo
    @Query("SELECT COUNT(p) FROM Pet p, CadastroCastracao c WHERE c.pet.id = p.id AND c.pagamento.confirmado = true AND c.statusProcesso != 'CONCLUIDO'")
    long countByStatusFila();

    @Query("SELECT p FROM Pet p, CadastroCastracao c WHERE c.pet.id = p.id AND c.pagamento.confirmado = true AND c.statusProcesso != 'CONCLUIDO'")
    List<Pet> findPetsFilaCastracao();
}