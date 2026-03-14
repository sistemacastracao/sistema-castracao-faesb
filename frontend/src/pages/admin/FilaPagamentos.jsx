import React, { useState, useEffect } from 'react';
import { 
    RefreshCw, PawPrint, Smile, Frown, 
    MessageCircle, Copy, ExternalLink, Phone, Info, Landmark, Search, Calendar, AlertCircle, X, Hash,
    Loader2 // Importado para o feedback de carregamento
} from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { enviarWhatsApp } from '../../services/whatsappService'; 

const FilaPagamentos = () => {
    const [fila, setFila] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // NOVO: Estado para o loader do modal

    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ id: null, tipo: '', titulo: '', mensagem: '', cor: '', item: null });

    const carregarFila = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/pagamentos/pendentes');
            setFila(Array.isArray(res.data) ? res.data : []);
        } catch (err) { toast.error("Erro ao carregar."); }
        finally { setLoading(false); }
    };

    useEffect(() => { carregarFila(); }, []);

    const abrirModal = (item, tipo) => {
        const config = tipo === 'aprovar' 
            ? { id: item.id, item, tipo, titulo: 'Confirmar Liquidação', mensagem: 'Deseja confirmar o recebimento deste pagamento?', cor: 'bg-emerald-600' }
            : { id: item.id, item, tipo, titulo: 'Recusar Pagamento', mensagem: 'Tem certeza que deseja recusar este pagamento?', cor: 'bg-red-600' };
        setModalConfig(config);
        setModalOpen(true);
    };

    const confirmarAcao = async () => {
        const { id, tipo, item } = modalConfig;
        
        setIsSubmitting(true); // Inicia o progresso
        
        try {
            const dadosWhats = {
                tutor: item.cadastro?.tutor?.nome || 'Tutor',
                pet: item.cadastro?.pet?.nomeAnimal || 'Pet'
            };
            const telefone = item.cadastro?.tutor?.whatsapp;

            if (tipo === 'aprovar') {
                await api.patch(`/admin/pagamentos/${id}/aprovar`);
                toast.success("Pagamento liquidado!");
                enviarWhatsApp(telefone, 'APROVADO', dadosWhats);
            } else {
                await api.patch(`/admin/pagamentos/${id}/rejeitar`);
                toast.success("Pagamento recusado.");
                enviarWhatsApp(telefone, 'REJEITADO', dadosWhats);
            }
            
            setModalOpen(false); // Só fecha o modal após o sucesso
            carregarFila();
        } catch (err) {
            toast.error("Erro na operação.");
        } finally {
            setIsSubmitting(false); // Para o progresso (independente de erro ou sucesso)
        }
    };

    const filaFiltrada = fila.filter(item => {
        const busca = filtro.toLowerCase();
        return (
            item.cadastro?.tutor?.nome?.toLowerCase().includes(busca) ||
            item.cadastro?.tutor?.cpf?.includes(busca) ||
            item.cadastro?.pet?.nomeAnimal?.toLowerCase().includes(busca)
        );
    });

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-[#003366]">CARREGANDO DADOS...</div>;

    return (
        <div className="p-2 md:p-4 max-w-[1600px] mx-auto space-y-4">
            
            {/* MODAL DE CONFIRMAÇÃO COM LOADER */}
            {modalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className={`p-6 ${modalConfig.cor} text-white flex justify-between items-center`}>
                            <h3 className="font-black uppercase italic tracking-tight">{modalConfig.titulo}</h3>
                            {!isSubmitting && (
                                <button onClick={() => setModalOpen(false)}><X size={20} /></button>
                            )}
                        </div>
                        <div className="p-8 text-center text-slate-600 font-medium">
                            {isSubmitting ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-[#003366]" size={40} />
                                    <p className="font-black uppercase italic text-xs animate-pulse">Processando Operação...</p>
                                </div>
                            ) : (
                                modalConfig.mensagem
                            )}
                        </div>
                        <div className="p-4 bg-slate-50 flex gap-3">
                            <button 
                                disabled={isSubmitting}
                                onClick={() => setModalOpen(false)} 
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-400 uppercase text-xs disabled:opacity-30"
                            >
                                Voltar
                            </button>
                            <button 
                                disabled={isSubmitting}
                                onClick={confirmarAcao} 
                                className={`flex-[1.5] px-6 py-3 rounded-2xl font-black text-white ${modalConfig.cor} uppercase text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale`}
                            >
                                {isSubmitting ? "Aguarde..." : "Confirmar e Avisar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#003366] p-6 rounded-[2rem] shadow-lg border-b-4 border-[#FFCC00]">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase italic leading-none tracking-tighter">Fila de Desembolso</h1>
                    <p className="text-blue-200 text-[10px] font-bold uppercase mt-1 tracking-widest">Conferência Manual de Comprovantes</p>
                </div>
                <div className="relative flex-1 max-w-xl w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar por tutor, CPF ou paciente..."
                        className="w-full bg-white/10 border-none rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:bg-white/20 transition-all"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>
                <button onClick={carregarFila} className="bg-white/10 p-4 rounded-2xl hover:bg-[#FFCC00] hover:text-[#003366] text-white transition-all"><RefreshCw size={20} /></button>
            </div>

            {/* LISTAGEM DE CARDS */}
            <div className="grid grid-cols-1 gap-4">
                {filaFiltrada.map((item) => {
                    const pet = item.cadastro?.pet || {};
                    const tutor = item.cadastro?.tutor || {};
                    const conta = item.contaDestino || {};
                    const dataCadastro = item.cadastro?.dataSolicitacao ? new Date(item.cadastro.dataSolicitacao).toLocaleDateString('pt-BR') : '---';

                    return (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-[2rem] p-5 flex flex-col xl:flex-row gap-6 hover:shadow-xl transition-all">
                            
                            {/* COLUNA 1: INFOS PET/TUTOR */}
                            <div className="flex-1 flex gap-4">
                                <div className="bg-slate-50 h-24 w-24 rounded-3xl flex flex-col items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                                    <PawPrint size={32} />
                                    <span className="text-[10px] font-black uppercase mt-1 leading-none">{pet.especie}</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase">{pet.sexo}</span>
                                </div>
                                <div className="flex flex-col justify-center overflow-hidden">
                                    <h3 className="text-lg font-black text-[#003366] uppercase italic leading-none truncate">{tutor.nome}</h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-[11px] text-slate-500 font-bold flex items-center gap-2 uppercase">
                                            <Phone size={12} className="text-blue-500" /> {tutor.whatsapp}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-bold flex items-center gap-2 uppercase">
                                            <Hash size={12} className="text-slate-300" /> CPF: {tutor.cpf}
                                        </p>
                                        <p className="text-[10px] text-slate-400 flex items-center gap-2 italic font-bold">
                                            <Calendar size={12} /> CADASTRADO EM: {dataCadastro}
                                        </p>
                                        <div className="bg-blue-50/50 p-2 rounded-xl mt-1 border border-blue-100/50">
                                            <p className="text-[11px] font-black text-[#003366] flex items-center gap-2 italic uppercase">
                                                <Info size={12} className="text-[#FFCC00]" /> Paciente: {pet.nomeAnimal}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 ml-5 uppercase">RAÇA: {pet.raca || 'S/R'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLUNA 2: DADOS BANCÁRIOS E PIX */}
                            <div className="flex-[1.5] bg-slate-50 p-5 rounded-[2rem] border-l-8 border-[#FFCC00] flex flex-col justify-between">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="overflow-hidden w-full">
                                        <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                            <Landmark size={12} /> Favorecido e Banco
                                        </span>
                                        <p className="text-sm font-bold text-[#003366] uppercase truncate leading-tight mt-1">
                                            {conta.nomeRecebedor || 'Favorecido não informado'}
                                        </p>
                                        <p className="text-[11px] font-mono font-black text-slate-600 bg-white/80 px-2 py-1 rounded-lg border border-slate-100 mt-2 inline-block">
                                            {conta.banco} | AG: {conta.agencia} | CC: {conta.contaCorrente || conta.conta || '---'}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[10px] font-black uppercase text-slate-400 italic">Total</span>
                                        <p className="text-2xl font-black text-emerald-600 italic leading-none">R$ {Number(item.valorContribuicao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-3 rounded-2xl mt-4 border border-slate-200 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Chave PIX ({conta.tipoChave || 'PIX'})
                                        </span>
                                        <p className="text-sm font-mono font-black text-slate-800 break-all leading-tight">
                                            {conta.chave || 'SEM CHAVE'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button 
                                            onClick={() => { navigator.clipboard.writeText(conta.chave); toast.success("Copiado!"); }} 
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-3 bg-slate-100 rounded-xl hover:bg-[#003366] hover:text-white transition-all text-slate-600"
                                        >
                                            <Copy size={18} />
                                            <span className="sm:hidden text-[10px] font-black uppercase">Copiar PIX</span>
                                        </button>
                                        <a 
                                            href={item.comprovanteUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#FFCC00] text-[#003366] rounded-xl text-[10px] font-black border border-[#e6b800] hover:scale-105 transition-all"
                                        >
                                            <ExternalLink size={16} /> <span className="sm:hidden lg:inline">DOC</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* COLUNA 3: AÇÕES */}
                            <div className="flex flex-row xl:flex-col gap-3 shrink-0">
                                <button 
                                    onClick={() => enviarWhatsApp(tutor.whatsapp, 'CONTATO_DIRETO', { tutor: tutor.nome, pet: pet.nomeAnimal })}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-4 xl:py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                                >
                                    <MessageCircle size={20} /> <span className="hidden sm:inline">WhatsApp</span>
                                </button>
                                <button onClick={() => abrirModal(item, 'aprovar')} className="flex-1 flex items-center justify-center gap-2 bg-[#003366] text-white px-4 py-4 xl:py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-800 transition-all shadow-md">
                                    <Smile size={20} /> <span className="hidden sm:inline">Aprovar</span>
                                </button>
                                <button onClick={() => abrirModal(item, 'rejeitar')} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-4 xl:py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100">
                                    <Frown size={20} /> <span className="hidden sm:inline">Recusar</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FilaPagamentos;