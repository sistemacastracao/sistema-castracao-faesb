package com.projeto.sistema_castracao_faesb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final String EMAIL_POLO = "Medicina Veterinária FAESB <sistemacastracao@gmail.com>";

    // =========================================================================
    // 1. CONFIRMAÇÃO DE PAGAMENTO (FOCO EM EXCELÊNCIA E ACOLHIMENTO)
    // =========================================================================
    public void enviarConfirmacaoPagamento(String para, String nomePet) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(EMAIL_POLO);
            message.setTo(para);
            message.setSubject("Confirmação de Inscrição - Medicina Veterinária FAESB: " + nomePet);

            String corpoEmail = String.format(
                    "Olá!\n\n" +
                            "É com satisfação que confirmamos o recebimento da taxa de consulta para o animal: %s.\n\n" +
                            "Agradecemos imensamente o seu apoio ao nosso projeto social. Saiba que seu pet está sob os cuidados " +
                            "de uma equipe de excelência, composta por Professores Doutores e Médicos Veterinários altamente qualificados " +
                            "da FAESB Tatuí.\n\n" +
                            "--- PRÓXIMOS PASSOS ---\n" +
                            "1. Seu cadastro agora faz parte da nossa fila oficial de atendimento.\n" +
                            "2. Aguarde: nossa equipe entrará em contato para agendar o dia e horário da consulta de avaliação.\n" +
                            "3. Lembramos que esta primeira etapa é uma consulta clínica para garantir a segurança do seu pet.\n" +
                            "4. Mantenha seu WhatsApp e e-mail sempre atualizados para não perder nossa convocação.\n\n" +
                            "Estamos ansiosos para recebê-los!\n\n" +
                            "Atenciosamente,\n" +
                            "Núcleo de Medicina Veterinária FAESB Tatuí", nomePet);

            message.setText(corpoEmail);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("ERRO EMAIL CONFIRMACAO: " + e.getMessage());
        }
    }

    // =========================================================================
    // 2. PAGAMENTO NÃO IDENTIFICADO (FOCO EM ORIENTAÇÃO E SUPORTE)
    // =========================================================================
    public void enviarEmailPagamentoNaoIdentificado(String para, String nomeTutor, String nomePet, String motivo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(EMAIL_POLO);
            message.setTo(para);
            message.setSubject("Importante: Pendência no Comprovante de Pagamento - FAESB");

            String corpoEmail = String.format(
                    "Olá, %s!\n\n" +
                            "Durante o processo de conferência, não conseguimos validar o comprovante de pagamento do PIX " +
                            "referente ao cadastro do animal %s.\n\n" +
                            "MOTIVO IDENTIFICADO: %s\n\n" +
                            "Para mantermos a organização da nossa fila de espera, este cadastro foi desativado temporariamente.\n\n" +
                            "COMO PROCEDER:\n" +
                            "- Caso você tenha realizado o pagamento corretamente com os valores solicitados e acredita que houve um erro na nossa análise, por favor, responda a este e-mail (sistemacastracao@gmail.com) enviando o comprovante novamente para verificação manual.\n" +
                            "- Se preferir, você pode acessar o portal e realizar um novo cadastro a qualquer momento utilizando o comprovante correto.\n\n" +
                            "Contamos com sua compreensão para mantermos a transparência e agilidade de nossos atendimentos sociais.\n\n" +
                            "Atenciosamente,\n" +
                            "Equipe de Auditoria - Medicina Veterinária FAESB Tatuí",
                    nomeTutor, nomePet, motivo);

            message.setText(corpoEmail);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("ERRO EMAIL PAGAMENTO NEGADO: " + e.getMessage());
        }
    }
}