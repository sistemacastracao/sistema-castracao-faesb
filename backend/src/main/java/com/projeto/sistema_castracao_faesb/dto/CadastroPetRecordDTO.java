package com.projeto.sistema_castracao_faesb.dto;

public record CadastroPetRecordDTO(
        // Dados do Tutor
        String nomeTutor,
        String cpf,
        String email,
        String whatsapp,

        // Dados de Endereço
        String logradouro,
        String numero,
        String bairro,
        String cidade,

        // Dados do Pet
        String nomePet,
        String especie,
        String raca,
        String sexo,
        String idadeAprox,

        // Dados do Processo/Pagamento
        String comprovantePixUrl
) {}