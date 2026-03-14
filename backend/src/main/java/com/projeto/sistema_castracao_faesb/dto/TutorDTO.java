package com.projeto.sistema_castracao_faesb.dto;

import com.projeto.sistema_castracao_faesb.model.Pet;
import com.projeto.sistema_castracao_faesb.model.Tutor;

import java.util.List;

public class TutorDTO {
    public Long id;
    public String nome;
    public String cpf;
    public String email;
    public String whatsapp;
    public String logradouro;
    public String numero;
    public String bairro;
    public String cidade;
    public String enderecoCompleto;
    public List<Pet> pets;

    // ESTA É A CHAVE PARA O REACT EXIBIR O NÚMERO NO CARD
    public int quantidadePets;

    public TutorDTO() {}

    public TutorDTO(Tutor tutor) {
        this.id = tutor.getId();
        this.nome = tutor.getNome();
        this.cpf = tutor.getCpf();
        this.email = tutor.getEmail();
        this.whatsapp = tutor.getWhatsapp();
        this.logradouro = tutor.getLogradouro();
        this.numero = tutor.getNumero();
        this.bairro = tutor.getBairro();
        this.cidade = tutor.getCidade();
        this.enderecoCompleto = tutor.getEnderecoCompleto();
        this.pets = tutor.getPets();

        // Sincroniza a contagem real da lista de pets da Entity para o DTO
        this.quantidadePets = (tutor.getPets() != null) ? tutor.getPets().size() : 0;
    }
}