package com.projeto.sistema_castracao_faesb.model;

import com.projeto.sistema_castracao_faesb.model.enums.StatusProcesso;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cadastros")
public class CadastroCastracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataSolicitacao = LocalDateTime.now();

    // AJUSTE: Trocado de String para o Enum StatusProcesso
    @Enumerated(EnumType.STRING)
    @Column(name = "status_processo", columnDefinition = "varchar(255)")
    private StatusProcesso statusProcesso = StatusProcesso.AGUARDANDO_CONFERENCIA;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @OneToOne(mappedBy = "cadastro", cascade = CascadeType.ALL)
    private Pagamento pagamento;

    public CadastroCastracao() {}

    // --- GETTERS E SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDateTime dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

    // Ajustado para retornar e receber o Enum
    public StatusProcesso getStatusProcesso() { return statusProcesso; }
    public void setStatusProcesso(StatusProcesso statusProcesso) { this.statusProcesso = statusProcesso; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }

    public Tutor getTutor() { return tutor; }
    public void setTutor(Tutor tutor) { this.tutor = tutor; }

    public Pagamento getPagamento() { return pagamento; }
    public void setPagamento(Pagamento pagamento) { this.pagamento = pagamento; }
}