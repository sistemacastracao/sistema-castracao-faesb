package com.projeto.sistema_castracao_faesb.repository;


import com.projeto.sistema_castracao_faesb.model.CadastroCastracao;
import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CadastroCastracaoRepository extends JpaRepository<CadastroCastracao, Long> {

    long countByStatusProcesso(StatusProcesso statusProcesso);
    List<CadastroCastracao> findByStatusProcesso(StatusProcesso statusProcesso);
    List<CadastroCastracao> findByPetId(Long petId);

    @Query("SELECT c FROM CadastroCastracao c WHERE c.tutor.cpf = :cpf")
    List<CadastroCastracao> findByTutorCpf(@Param("cpf") String cpf);

    // Esse é o único que o seu Service precisa para o histórico:
    List<CadastroCastracao> findByTutorId(Long tutorId);

    List<CadastroCastracao> findByStatusProcessoIn(List<StatusProcesso> statusLista);



}