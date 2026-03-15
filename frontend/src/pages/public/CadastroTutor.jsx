import React, { useState, useEffect } from 'react';
import api from '../../api/api';

// Componentes de UI Inteligentes
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

// Ícones
import {
    Stethoscope, CreditCard, CheckCircle, UploadCloud,
    PawPrint, MapPin, User, Mail, Phone, Hash, Info
} from 'lucide-react';
import logoVet from "../../assets/veterinaria.jpg";

const CadastroTutor = () => {
    const [sistemaAberto, setSistemaAberto] = useState(true);
    const [etapa, setEtapa] = useState(1);
    const [arquivo, setArquivo] = useState(null);
    const [isEnviando, setIsEnviando] = useState(false);
    const [mensagemErro, setMensagemErro] = useState(null);

    const [dados, setDados] = useState({
        nomeTutor: '', cpf: '', email: '', whatsapp: '',
        logradouro: '', numero: '', bairro: '', cidade: 'Tatuí',
        nomePet: '', especie: 'CACHORRO', raca: '', sexo: 'MACHO',
        idadeAprox: ''
    });

    const [dadosPix, setDadosPix] = useState({
        chave: 'carregando...',
        valor: '0.00',
        beneficiario: 'FAESB Tatuí',
        banco: 'Consultando...',
        agencia: '0000',
        conta: '0000'
    });

    useEffect(() => {
        const verificar = async () => {
            try {
                const res = await api.get('/sistema/status');
                if (!res.data.cadastroAberto) {
                    // Se estiver fechado, manda ele de volta para a Home/Aviso
                    window.location.href = "/";
                }
            } catch (e) {
                console.error("Erro na trava de segurança");
            }
        };
        verificar();
    }, []);

    useEffect(() => {
        if (etapa === 5) {
            const fetchPix = async () => {
                try {
                    const response = await api.get('/admin/configuracao-pix/ativa');
                    if (response.data) setDadosPix(response.data);
                } catch (error) {
                    console.error("Erro ao buscar PIX:", error);
                }
            };
            fetchPix();
        }
    }, [etapa]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDados(prev => ({ ...prev, [name]: value }));
    };

    // Sempre que o usuário digitar algo, nós escondemos o erro.
    // Isso dá a sensação de que o sistema é ágil e entende a correção.
    useEffect(() => {
        if (mensagemErro) {
            setMensagemErro(null);
        }
    }, [dados]);

    const validarEtapaAtual = () => {
        setMensagemErro(null);

        const validacoes = {
            1: () => {
                // Remove tudo que não é número para validar a quantidade real
                const cpfLimpo = (dados.cpf || "").replace(/\D/g, '');
                if (cpfLimpo.length !== 11) {
                    return "CPF incompleto. Verifique os 11 números.";
                }
            },
            2: () => {
                if (!dados.nomeTutor?.trim()) return "O nome do tutor é obrigatório.";

                // Validação de email mais segura
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(dados.email || "")) return "Por favor, insira um e-mail válido.";

                // WhatsApp: Limpa a máscara e vê se tem pelo menos 10 ou 11 dígitos
                const zapLimpo = (dados.whatsapp || "").replace(/\D/g, '');
                if (zapLimpo.length < 10) return "O número de WhatsApp parece incompleto.";
            },
            3: () => {
                if (!dados.logradouro || !dados.numero || !dados.bairro) {
                    return "Endereço incompleto. CEP, Número e Bairro são essenciais.";
                }
            },
            4: () => {
                if (!dados.nomePet?.trim()) return "O nome do pet é obrigatório.";
                if (!dados.raca?.trim()) return "Informe a raça (ou digite SRD).";
                if (!dados.idadeAprox?.trim()) return "Qual a idade aproximada do pet?";
            }
        };

        const erro = validacoes[etapa]?.();

        if (erro) {
            setMensagemErro(erro);
            // Opcional: Um leve scroll para o topo para o usuário ver a mensagem de erro
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        return true;
    };

    const nextStep = () => {
        if (validarEtapaAtual()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setEtapa(prev => prev + 1);
            setMensagemErro(null);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!arquivo) return setMensagemErro("⚠️ O comprovante é obrigatório.");

        setIsEnviando(true);

        try {
            const formData = new FormData();

            // 1. O arquivo binário
            formData.append('arquivo', arquivo);

            // 2. O objeto mapeado (garanta que os nomes à direita 'dados.xxx' batam com seu useState)
            const payload = {
                nomeTutor: dados.nomeTutor, // Ajustado de dados.nome para dados.nomeTutor
                cpf: (dados.cpf || "").replace(/\D/g, ''),
                whatsapp: dados.whatsapp,
                email: dados.email,
                logradouro: dados.logradouro,
                numero: dados.numero,
                bairro: dados.bairro,
                cidade: dados.cidade,
                nomePet: dados.nomePet,
                especie: dados.especie,
                raca: dados.raca,
                sexo: dados.sexo,
                idadeAprox: dados.idadeAprox
            };

            // 3. A "Mágica" que resolve o erro do Spring:
            // Envelopamos o JSON em um Blob com o tipo application/json
            formData.append('dados', new Blob([JSON.stringify(payload)], {
                type: 'application/json'
            }));

            await api.post('/cadastros', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setEtapa(6);
        } catch (error) {
            console.error("Erro no envio:", error.response);
            setMensagemErro(error.response?.data?.erro || "❌ Erro ao salvar cadastro.");
        } finally {
            setIsEnviando(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

                    {/* LATERAL ESQUERDA (DASHBOARD LATERAL) */}
                    <div className="md:w-1/3 bg-[#2D5A27] p-8 text-white flex flex-col items-center justify-between text-center relative overflow-hidden">

                        {/* Efeito de luz de fundo para destacar o topo */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center w-full">
                            {/* CONTAINER DA LOGO - Ajustado para centralização total e responsividade */}
                            <div className="relative group mb-6">
                                <div className="absolute inset-0 bg-[#FFCC00] rounded-full blur opacity-20 group-hover:opacity-40 transition-duration-500"></div>
                                <div className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center bg-white rounded-full p-1 shadow-2xl border-4 border-white/20 overflow-hidden">
                                    <img
                                        src={logoVet}
                                        alt="Logo"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>

                            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-none">
                                Medicina <br />
                                <span className="text-[#FFCC00]">Veterinária</span>
                            </h1>

                            <div className="mt-2 inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <p className="text-white text-[9px] font-black uppercase tracking-[0.2em]">FAESB Tatuí</p>
                            </div>
                        </div>

                        {/* PROGRESS TRACKER - Estilizado com Glassmorphism */}
                        <div className="hidden md:flex mt-12 w-full flex-col gap-3 relative z-10">
                            {[
                                { n: 1, t: 'CPF' }, { n: 2, t: 'Tutor' },
                                { n: 3, t: 'Endereço' }, { n: 4, t: 'Pet' },
                                { n: 5, t: 'Pagamento' }
                            ].map(item => (
                                <div
                                    key={item.n}
                                    className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-500 border ${etapa === item.n
                                        ? 'bg-white text-[#1B365D] border-white shadow-lg translate-x-4'
                                        : etapa > item.n
                                            ? 'bg-white/10 text-white/90 border-transparent opacity-60'
                                            : 'bg-transparent text-white/30 border-transparent opacity-30'
                                        }`}
                                >
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shadow-sm ${etapa >= item.n ? 'bg-[#FFCC00] text-[#1B365D]' : 'bg-white/10'
                                        }`}>
                                        {item.n}
                                    </span>
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.t}</span>

                                    {etapa > item.n && (
                                        <CheckCircle size={14} className="ml-auto text-green-400" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Rodapé da lateral - Decorativo */}
                        <div className="hidden md:block mt-auto pt-8 opacity-20">
                            <PawPrint size={40} className="mx-auto rotate-12" />
                        </div>
                    </div>

                    {/* CONTEÚDO DINÂMICO */}
                    <div className="flex-1 p-6 md:p-12 bg-white flex flex-col">

                        {/* ADICIONE ESTE BLOCO ABAIXO: BARRA DE PROGRESSO MOBILE */}
                        {etapa < 6 && (
                            <div className="md:hidden mb-10 space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-[#1B365D] uppercase tracking-widest">
                                        Etapa {etapa} de 5
                                    </span>
                                    <span className="text-[10px] font-black text-[#2D5A27] uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">
                                        {Math.round((etapa / 5) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                    <div
                                        className="bg-gradient-to-r from-[#2D5A27] to-[#FFCC00] h-full transition-all duration-700 ease-in-out rounded-full"
                                        style={{ width: `${(etapa / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {etapa === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <header>
                                    <h2 className="text-3xl font-black text-[#1B365D] tracking-tighter">Olá!</h2>
                                    <p className="text-slate-400 font-medium">Esse é o formulário para consulta pré castração - FAESB.</p>
                                    <p className="text-xs font-normal text-slate-400">Insira o CPF do responsável pelo pet.</p></header>
                                <Input
                                    label="CPF do Responsável"
                                    name="cpf"
                                    mask="CPF"
                                    icon={Hash}
                                    value={dados.cpf}
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                />
                                <Button onClick={nextStep} icon={CheckCircle}>Iniciar Inscrição</Button>
                            </div>
                        )}

                        {etapa === 2 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-black text-[#1B365D] uppercase tracking-tighter flex items-center gap-2">
                                    <User className="text-[#FFCC00]" size={20} /> Dados do Tutor
                                </h2>
                                <Input label="Nome Completo" name="nomeTutor" icon={User} value={dados.nomeTutor} onChange={handleChange} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="WhatsApp" name="whatsapp" mask="PHONE" icon={Phone} value={dados.whatsapp} onChange={handleChange} />
                                    <Input label="E-mail" name="email" type="email" icon={Mail} value={dados.email} onChange={handleChange} />
                                </div>
                                <div className="flex flex-col md:flex-row gap-3 pt-4">
                                    <Button variant="outline" size="sm" onClick={() => setEtapa(1)}>Voltar</Button>
                                    <Button onClick={nextStep}>Próximo Passo</Button>
                                </div>
                            </div>
                        )}

                        {etapa === 3 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-black text-[#1B365D] uppercase tracking-tighter flex items-center gap-2">
                                    <MapPin className="text-[#2D5A27]" size={20} /> Endereço
                                </h2>
                                <Input label="Rua / Logradouro" name="logradouro" value={dados.logradouro} onChange={handleChange} />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <Input label="Número" name="numero" value={dados.numero} onChange={handleChange} />
                                    <div className="md:col-span-2">
                                        <Input label="Bairro" name="bairro" value={dados.bairro} onChange={handleChange} />
                                    </div>
                                </div>
                                <Input label="Cidade" name="cidade" value={dados.cidade} onChange={handleChange} disabled />
                                <div className="flex flex-col md:flex-row gap-3 pt-4">
                                    <Button variant="outline" size="sm" onClick={() => setEtapa(2)}>Voltar</Button>
                                    <Button onClick={nextStep}>Dados do Animal</Button>
                                </div>
                            </div>
                        )}

                        {etapa === 4 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-xl font-black text-[#1B365D] uppercase tracking-tighter flex items-center gap-2">
                                    <PawPrint className="text-[#2D5A27]" size={20} /> Paciente Pet
                                </h2>

                                <Input
                                    label="Nome do Pet"
                                    name="nomePet"
                                    icon={PawPrint}
                                    value={dados.nomePet}
                                    onChange={handleChange}
                                    placeholder="Ex: Rex, Thor, Luna..."
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#1B365D] uppercase ml-1">Espécie</label>
                                        <select name="especie" value={dados.especie} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-semibold text-[#1B365D] outline-none focus:border-[#2D5A27] text-base transition-all">
                                            <option value="CACHORRO">Cachorro</option>
                                            <option value="GATO">Gato</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#1B365D] uppercase ml-1">Sexo</label>
                                        <select name="sexo" value={dados.sexo} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-200 p-3 rounded-xl font-semibold text-[#1B365D] outline-none focus:border-[#2D5A27] text-base transition-all">
                                            <option value="MACHO">Macho</option>
                                            <option value="FEMEA">Fêmea</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Raça"
                                        name="raca"
                                        value={dados.raca}
                                        onChange={handleChange}
                                        placeholder="Ex: SRD ou Sem Raça Definida"
                                    />
                                    <Input
                                        label="Idade Aprox."
                                        name="idadeAprox"
                                        value={dados.idadeAprox}
                                        onChange={handleChange}
                                        placeholder="Ex: 3 anos"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-3 pt-4">
                                    <Button variant="outline" size="sm" onClick={() => setEtapa(3)}>Voltar</Button>
                                    <Button onClick={nextStep}>Ir para Pagamento</Button>
                                </div>
                            </div>
                        )}

                        {etapa === 5 && (
                            <div className="space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="text-center space-y-1">
                                    <h2 className="text-2xl font-black text-[#1B365D] tracking-tighter uppercase">Pagamento</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taxa de Pré-Consulta Medicina Veterinária</p>
                                </div>

                                {/* CARTÃO DE PAGAMENTO DINÂMICO PIX ATIVO */}
                                <div className="bg-[#1B365D] p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border-b-[10px] border-[#FFCC00]">
                                    <div className="absolute -top-10 -right-10 opacity-10 rotate-12 pointer-events-none">
                                        <CreditCard size={150} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-center mb-8">
                                            <p className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em]">Valor Total</p>

                                            {/* SKELETON DO VALOR */}
                                            {dadosPix.chave === 'carregando...' ? (
                                                <div className="h-12 w-40 bg-white/20 animate-pulse rounded-2xl mx-auto mt-2" />
                                            ) : (
                                                <p className="text-5xl font-black text-[#FFCC00] mt-1 italic">R$ {dadosPix.valorTaxa}</p>
                                            )}

                                            <p className="text-[11px] font-bold uppercase mt-2 text-white/90 tracking-wider">
                                                {dadosPix.beneficiario}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${dadosPix.chave === 'carregando...'
                                                    ? 'bg-white/5 border-white/5 cursor-wait'
                                                    : 'bg-white/10 border-white/20 hover:bg-white/20 active:scale-95'
                                                    }`}
                                                onClick={() => {
                                                    if (dadosPix.chave !== 'carregando...') {
                                                        navigator.clipboard.writeText(dadosPix.chave);
                                                        alert("Chave PIX copiada!");
                                                    }
                                                }}
                                            >
                                                <p className="text-[8px] font-black uppercase opacity-50 mb-1 tracking-widest group-hover:text-[#FFCC00] transition-colors">
                                                    Chave PIX (Toque para copiar)
                                                </p>

                                                {/* SKELETON DA CHAVE */}
                                                {dadosPix.chave === 'carregando...' ? (
                                                    <div className="h-4 w-full bg-white/10 animate-pulse rounded-md mt-1" />
                                                ) : (
                                                    <p className="text-sm font-mono font-bold break-all leading-tight">{dadosPix.chave}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                    <p className="text-[8px] font-black uppercase opacity-50 mb-1 tracking-widest">Banco</p>
                                                    {dadosPix.chave === 'carregando...' ? (
                                                        <div className="h-3 w-16 bg-white/10 animate-pulse rounded" />
                                                    ) : (
                                                        <p className="text-xs font-bold uppercase truncate">{dadosPix.banco}</p>
                                                    )}
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                                    <p className="text-[8px] font-black uppercase opacity-50 mb-1 tracking-widest">Ag / Conta</p>
                                                    {dadosPix.chave === 'carregando...' ? (
                                                        <div className="h-3 w-20 bg-white/10 animate-pulse rounded" />
                                                    ) : (
                                                        <p className="text-xs font-bold">{dadosPix.agencia} / {dadosPix.conta}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* UPLOAD DO COMPROVANTE */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-[#1B365D] uppercase ml-1 flex items-center gap-2">
                                        <UploadCloud size={14} className="text-[#2D5A27]" /> Anexe o comprovante abaixo
                                    </p>
                                    <div className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 ${arquivo ? 'border-[#2D5A27] bg-green-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-[#1B365D]/30'
                                        }`}>
                                        <input type="file" id="file" onChange={(e) => setArquivo(e.target.files[0])} className="hidden" />
                                        <label htmlFor="file" className="cursor-pointer flex flex-col items-center justify-center p-8 text-center">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all duration-500 group-hover:scale-110 ${arquivo ? 'bg-[#2D5A27] text-white rotate-0' : 'bg-white text-slate-400 -rotate-12'
                                                }`}>
                                                {arquivo ? <CheckCircle size={28} /> : <UploadCloud size={28} />}
                                            </div>
                                            <span className="text-[11px] font-black text-[#1B365D] uppercase tracking-tighter max-w-[200px] truncate">
                                                {arquivo ? arquivo.name : "Clique para selecionar o arquivo"}
                                            </span>
                                            {!arquivo && (
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                                                    Fotos, Prints ou PDF do Banco
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    loading={isEnviando}
                                    variant="primary"
                                    size="lg"
                                    icon={CheckCircle}
                                    className="shadow-xl shadow-green-900/10"
                                >
                                    Concluir e Enviar
                                </Button>

                                <button
                                    onClick={() => setEtapa(4)}
                                    className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1B365D] transition-colors py-2"
                                >
                                    ← Voltar para dados do Pet
                                </button>
                            </div>
                        )}

                        {etapa === 6 && (
                            <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-500">
                                {/* ÍCONE DE SUCESSO ANIMADO */}
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                                    <div className="relative w-24 h-24 bg-green-50 text-[#2D5A27] rounded-full flex items-center justify-center shadow-inner border-4 border-white">
                                        <CheckCircle size={48} strokeWidth={3} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-[#1B365D] tracking-tighter">PRONTINHO!</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                                        O cadastro do <strong>{dados.nomePet}</strong> foi recebido com sucesso pela equipe da <strong>FAESB</strong>.
                                    </p>
                                </div>

                                {/* EFEITO DE RECIBO / TICKET */}
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 max-w-sm mx-auto relative overflow-hidden">
                                    {/* Círculos laterais para parecer um ticket recortado */}
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-2 border-slate-200"></div>
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-2 border-slate-200"></div>

                                    <div className="space-y-3 text-left">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                                            <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Aguardando Análise</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Paciente</span>
                                            <span className="text-xs font-bold text-[#1B365D]">{dados.nomePet}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">Data</span>
                                            <span className="text-xs font-bold text-[#1B365D]">{new Date().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <p className="text-[10px] font-black text-[#1B365D] uppercase tracking-widest opacity-60">
                                        Aguarde nosso contato via WhatsApp
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.reload()}
                                        className="border-2 border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white"
                                    >
                                        Fazer Novo Cadastro
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            {/* MODAL DE ERRO */}
            {mensagemErro && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#1B365D]/80 backdrop-blur-md p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] md:rounded-[2rem] max-w-sm w-full text-center shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Info size={32} />
                        </div>
                        <h3 className="text-[#1B365D] font-black uppercase text-xs mb-2">Atenção</h3>
                        <p className="text-slate-600 font-bold text-sm mb-8 leading-tight">{mensagemErro}</p>
                        <Button onClick={() => setMensagemErro(null)}>Entendido</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CadastroTutor;