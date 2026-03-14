package com.projeto.sistema_castracao_faesb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "animais")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeAnimal;
    private String especie;
    private String sexo;
    private String idadeAprox;

    @Column(nullable = false)
    private String raca = "Não Definida";

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    @JsonBackReference // Evita o loop infinito com a classe Tutor na serialização JSON
    private Tutor tutor;

    public Pet() {}

    // --- GETTERS E SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomeAnimal() { return nomeAnimal; }
    public void setNomeAnimal(String nomeAnimal) { this.nomeAnimal = nomeAnimal; }

    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }

    public String getSexo() { return sexo; }
    public void setSexo(String sexo) { this.sexo = sexo; }

    public String getIdadeAprox() { return idadeAprox; }
    public void setIdadeAprox(String idadeAprox) { this.idadeAprox = idadeAprox; }

    public String getRaca() { return raca; }
    public void setRaca(String raca) { this.raca = raca; }

    public Tutor getTutor() { return tutor; }
    public void setTutor(Tutor tutor) { this.tutor = tutor; }
}