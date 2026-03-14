package com.projeto.sistema_castracao_faesb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamentos")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comprovanteUrl;
    private boolean confirmado = false;
    @Column(precision = 10, scale = 2) // Adicione esta anotação para o Banco de Dados
    private BigDecimal valorContribuicao;
    private LocalDateTime dataConfirmacao;

    @OneToOne
    @JoinColumn(name = "cadastro_id")
    @JsonIgnoreProperties({"pagamento", "handler", "hibernateLazyInitializer"})
    private CadastroCastracao cadastro;

    // --- AUDITORIA E EXTRATO ---

    @ManyToOne
    @JoinColumn(name = "aprovador_id")
    @JsonIgnoreProperties({"senha", "dataCadastro", "hibernateLazyInitializer", "handler"})
    private Administrador aprovadoPor; // Alterado para Administrador (Master ou Vet)

    private String aprovadorNome; // Grava o nome como String para histórico eterno

    @ManyToOne
    @JoinColumn(name = "pix_config_id")
    @JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
    private ConfiguracaoPix contaDestino;

    // --- CONSTRUTORES ---

    public Pagamento() {}

    // --- GETTERS E SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComprovanteUrl() { return comprovanteUrl; }
    public void setComprovanteUrl(String comprovanteUrl) { this.comprovanteUrl = comprovanteUrl; }

    public boolean isConfirmado() { return confirmado; }
    public void setConfirmado(boolean confirmado) { this.confirmado = confirmado; }

    // Ajuste os Getters e Setters para BigDecimal:
    public BigDecimal getValorContribuicao() { return valorContribuicao; }
    public void setValorContribuicao(BigDecimal valorContribuicao) { this.valorContribuicao = valorContribuicao; }

    public LocalDateTime getDataConfirmacao() { return dataConfirmacao; }
    public void setDataConfirmacao(LocalDateTime dataConfirmacao) { this.dataConfirmacao = dataConfirmacao; }

    public CadastroCastracao getCadastro() { return cadastro; }
    public void setCadastro(CadastroCastracao cadastro) { this.cadastro = cadastro; }

    public Administrador getAprovadoPor() { return aprovadoPor; }
    public void setAprovadoPor(Administrador aprovadoPor) { this.aprovadoPor = aprovadoPor; }

    public String getAprovadorNome() { return aprovadorNome; }
    public void setAprovadorNome(String aprovadorNome) { this.aprovadorNome = aprovadorNome; }

    public ConfiguracaoPix getContaDestino() { return contaDestino; }
    public void setContaDestino(ConfiguracaoPix contaDestino) { this.contaDestino = contaDestino; }
}