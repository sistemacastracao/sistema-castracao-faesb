package com.projeto.sistema_castracao_faesb.config;

import com.projeto.sistema_castracao_faesb.model.Administrador;
import com.projeto.sistema_castracao_faesb.model.ConfiguracaoPix;
import com.projeto.sistema_castracao_faesb.model.enums.Role;
import com.projeto.sistema_castracao_faesb.repository.AdministradorRepository;
import com.projeto.sistema_castracao_faesb.repository.ConfiguracaoPixRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private AdministradorRepository adminRepository;

    @Autowired
    private ConfiguracaoPixRepository pixRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Ajustado para ler o caminho definido no application.yml
    @Value("${seeder.admin.nome}")
    private String adminNome;

    @Value("${seeder.admin.email}")
    private String adminEmail;

    @Value("${seeder.admin.password}")
    private String adminSenha;

    @Value("${seeder.pix.chave}")
    private String pixChave;

    @Value("${seeder.pix.tipo}")
    private String pixTipoChave;

    @Value("${seeder.pix.recebedor}")
    private String pixRecebedor;

    @Value("${seeder.pix.documento}")
    private String pixDocumento;

    @Value("${seeder.pix.banco}")
    private String pixBanco;

    @Value("${seeder.pix.agencia}")
    private String pixAgencia;

    @Value("${seeder.pix.conta}")
    private String pixConta;

    @Value("${seeder.pix.valor}")
    private BigDecimal pixValorTaxa;

    @Override
    public void run(String... args) throws Exception {

        // 1. SEEDER DO ADMINISTRADOR MASTER
        if (adminRepository.count() == 0) {
            Administrador adminMaster = new Administrador();
            adminMaster.setNome(adminNome);
            adminMaster.setEmail(adminEmail);
            adminMaster.setSenha(passwordEncoder.encode(adminSenha));
            adminMaster.setNivelAcesso(Role.MASTER);
            adminMaster.setAtivo(true);

            adminRepository.save(adminMaster);
            System.out.println("✅ Administrador Master [" + adminNome + "] criado com sucesso!");
        }

        // 2. SEEDER DA CONFIGURAÇÃO PIX
        if (pixRepository.count() == 0) {
            ConfiguracaoPix configInicial = new ConfiguracaoPix();
            configInicial.setChave(pixChave);
            configInicial.setTipoChave(pixTipoChave);
            configInicial.setNomeRecebedor(pixRecebedor);
            configInicial.setDocumentoRecebedor(pixDocumento);
            configInicial.setBanco(pixBanco);
            configInicial.setAgencia(pixAgencia);
            configInicial.setConta(pixConta);
            configInicial.setValorTaxa(pixValorTaxa);
            configInicial.setAtivo(true);
            configInicial.setDataCriacao(LocalDateTime.now());

            pixRepository.save(configInicial);
            System.out.println("✅ Configuração PIX inicializada para: " + pixRecebedor);
        }
    }
}