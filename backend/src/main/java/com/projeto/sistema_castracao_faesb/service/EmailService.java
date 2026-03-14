package com.projeto.sistema_castracao_faesb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Nome de exibição ajustado para Medicina Veterinária
    private static final String EMAIL_POLO = "Polo FAESB Medicina Veterinária <sistemacastracao@gmail.com>";

    // =========================================================================
    // 1. COMUNICAÇÃO COM TUTORES
    // =========================================================================

    public void enviarConfirmacaoPagamento(String para, String nomePet) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(EMAIL_POLO);
            message.setTo(para);
            message.setSubject("Pagamento Confirmado - Polo FAESB Medicina Veterinária: " + nomePet);

            String corpoEmail = String.format(
                    "Olá!\n\nConfirmamos o recebimento da taxa de contribuição referente ao animal: %s.\n\n" +
                            "Seu pet entrou na nossa fila de espera oficial do Polo de Medicina Veterinária.\n\n" +
                            "--- PRÓXIMOS PASSOS ---\n" +
                            "1. Aguarde nosso contato para definir a data e hora do agendamento.\n" +
                            "2. No dia, o animal deverá estar em jejum absoluto de 8 horas (água e comida).\n" +
                            "3. Mantenha seus dados de contato e WhatsApp sempre atualizados.\n\n" +
                            "Atenciosamente,\nPolo FAESB Medicina Veterinária Tatuí", nomePet);

            message.setText(corpoEmail);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("ERRO EMAIL CONFIRMACAO: " + e.getMessage());
        }
    }

    public void enviarEmailPagamentoNaoIdentificado(String para, String nomeTutor, String nomePet, String motivo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(EMAIL_POLO);
            message.setTo(para);
            message.setSubject("⚠️ Pendência no Cadastro - Polo FAESB Medicina Veterinária");

            String corpoEmail = String.format(
                    "Olá, %s!\n\n" +
                            "Informamos que a equipe de auditoria do Polo de Medicina Veterinária não conseguiu validar " +
                            "o comprovante de pagamento referente ao animal %s.\n\n" +
                            "MOTIVO DA PENDÊNCIA: %s\n\n" +
                            "Para garantir a integridade da fila de castração, o cadastro foi removido do nosso sistema.\n\n" +
                            "Caso você tenha realizado o pagamento e acredita que houve um erro, entre em contato " +
                            "conosco imediatamente. Se desejar, você pode realizar um novo cadastro utilizando o comprovante correto.\n\n" +
                            "Atenciosamente,\nEquipe de Auditoria - Polo FAESB Medicina Veterinária Tatuí",
                    nomeTutor, nomePet, motivo);

            message.setText(corpoEmail);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("ERRO EMAIL PAGAMENTO NEGADO: " + e.getMessage());
        }
    }
}