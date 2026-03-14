package com.projeto.sistema_castracao_faesb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tutores")
public class Tutor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Garante que o Hibernate e o Jackson usem exatamente o nome "nome"
    @Column(name = "nome")
    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    private String email;
    private String whatsapp;

    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;

    // Removemos o "private String endereco" daqui para não criar coluna nula no banco
    // O endereço será apenas uma representação visual para o Frontend

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Pet> pets = new ArrayList<>();

    public Tutor() {}

    // --- COMPATIBILIDADE COM O REACT ---

    // Este método faz com que o JSON enviado para o React tenha um campo "endereco"
    @JsonProperty("endereco")
    public String getEnderecoCompleto() {
        StringBuilder sb = new StringBuilder();
        if (logradouro != null) sb.append(logradouro);
        if (numero != null) sb.append(", ").append(numero);
        if (bairro != null) sb.append(" - ").append(bairro);
        if (cidade != null) sb.append(" (").append(cidade).append(")");
        return sb.toString();
    }

    // Caso o React envie um campo "endereco" no JSON, o Java ignora para não dar erro
    @JsonProperty("endereco")
    public void setEndereco(String endereco) {
        // Não faz nada, apenas evita erro de "campo desconhecido" no Jackson
    }
    // --- CONTAGEM DE PETS PARA O FRONTEND ---

    @JsonProperty("quantidadePets")
    public int getQuantidadePets() {
        return (pets != null) ? pets.size() : 0;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }
}