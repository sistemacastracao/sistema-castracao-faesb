export const enviarWhatsApp = (telefone, acao, dados) => {
    if (!telefone) return;

    const numeroLimpo = telefone.replace(/\D/g, '');
    const telefoneFinal = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;

    const mensagens = {
        'APROVADO': `Olá, *${dados.tutor}*! 🐾\n\nSua contribuição para o pet *${dados.pet}* foi aprovada! \n\n✅ *Próximo passo:* Nossa equipe entrará em contato em breve para alinhar os detalhes. A FAESB agradece seu apoio!`,
        
        'CONTATO_DIRETO': `Olá, *${dados.tutor}*, aqui é da FAESB. Gostaria de falar sobre o cadastro do pet *${dados.pet}*...`,
        
        'REJEITADO': `Olá, *${dados.tutor}*.\n\nInformamos que seu cadastro para o pet *${dados.pet}* não pôde ser aprovado neste momento.\n\n⚠️ *Orientação:* Por favor, refaça o cadastro com as informações corretas para a consulta ou entre em contato conosco pelo e-mail: *sistemacastracao@gmail.com*`
    };

    const url = `https://api.whatsapp.com/send?phone=${telefoneFinal}&text=${encodeURIComponent(mensagens[acao])}`;
    window.open(url, '_blank');
};