package com.projeto.sistema_castracao_faesb.config;

import com.projeto.sistema_castracao_faesb.model.Administrador;
import com.projeto.sistema_castracao_faesb.model.ConfiguracaoPix;
import com.projeto.sistema_castracao_faesb.model.enums.Role;
import com.projeto.sistema_castracao_faesb.repository.AdministradorRepository;
import com.projeto.sistema_castracao_faesb.repository.ConfiguracaoPixRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Override
    public void run(String... args) throws Exception {

        // 1. SEEDER DO ADMINISTRADOR MASTER (FAESB)
        if (adminRepository.count() == 0) {
            Administrador adminMaster = new Administrador();
            adminMaster.setNome("Polo de Castracao FAESB Tatuí"); // Nome atualizado
            adminMaster.setEmail("sistemacastracao@gmail.com");
            adminMaster.setSenha(passwordEncoder.encode("admin123"));
            adminMaster.setNivelAcesso(Role.MASTER);
            adminMaster.setAtivo(true);

            adminRepository.save(adminMaster);
            System.out.println("✅ Administrador Master [FAESB Tatuí] criado!");
        }

        // 2. SEEDER DA CONFIGURAÇÃO PIX (TAXA ATUALIZADA: R$ 60,00)
        if (pixRepository.count() == 0) {
            ConfiguracaoPix configInicial = new ConfiguracaoPix();
            configInicial.setChave("sistemacastracao@gmail.com");
            configInicial.setTipoChave("E-mail");
            configInicial.setNomeRecebedor("Polo FAESB Tatuí"); // Nome atualizado
            configInicial.setDocumentoRecebedor("10.561.701/0001-34");
            configInicial.setBanco("Nubank");

            // CAMPOS OBRIGATÓRIOS
            configInicial.setAgencia("0001");
            configInicial.setConta("123456-7");

            configInicial.setValorTaxa(new BigDecimal("60.00"));
            configInicial.setAtivo(true);
            configInicial.setDataCriacao(LocalDateTime.now());

            pixRepository.save(configInicial);
            System.out.println("✅ Configuração PIX inicializada para o Polo FAESB Tatuí.");
        }
    }
}