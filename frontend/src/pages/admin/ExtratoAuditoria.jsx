import React, { useState, useEffect } from 'react';
import { 
    Search, RefreshCw, BarChart3, Clock, 
    PawPrint, CalendarDays, FileText, 
    UserCheck, Banknote, FilterX, Landmark,
    ShieldCheck, User, CreditCard, Hash, ArrowUpRight
} from 'lucide-react';
import api from '../../api/api'; 
import StatCard from '../../components/charts/StatCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const ExtratoAuditoria = () => {
    const [extrato, setExtrato] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [filtroData, setFiltroData] = useState("");

    const formatarUrlComprovante = (url) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `${process.env.REACT_APP_API_URL}${url}`;
    };

    const carregarExtrato = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/pagamentos/extrato');
            setExtrato(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Erro na auditoria:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarExtrato(); }, []);

    const extratoFiltrado = extrato.filter(p => {
        const termo = filtro.toLowerCase();
        const dataPagamento = p.dataConfirmacao ? p.dataConfirmacao.split('T')[0] : "";
        return (
            (p.cadastro?.pet?.nomeAnimal || "").toLowerCase().includes(termo) ||
            (p.cadastro?.tutor?.nome || "").toLowerCase().includes(termo) ||
            (p.aprovadorNome || p.aprovadoPor?.nome || "").toLowerCase().includes(termo)
        ) && (filtroData === "" || dataPagamento === filtroData);
    });

    if (loading && extrato.length === 0) return (
        <div className="flex h-96 flex-col items-center justify-center text-[#003366] font-black animate-pulse">
            <RefreshCw className="animate-spin mb-4" size={40} />
            <span className="tracking-[0.3em] text-xs uppercase italic">Sincronizando Livro de Auditoria...</span>
        </div>
    );

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-700 px-2 md:px-0 bg-slate-50/50">
            
            {/* 1. DASHBOARD DE ALTO IMPACTO */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    label="Receita Auditada" 
                    value={`R$ ${extratoFiltrado.reduce((acc, curr) => acc + (curr.contaDestino?.valorTaxa || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                    icon={<Banknote className="text-white"/>} color="bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-200" 
                />
                <StatCard 
                    label="Fluxo de Operações" 
                    value={extratoFiltrado.length.toString()} 
                    icon={<BarChart3 className="text-white"/>} color="bg-gradient-to-br from-[#1B365D] to-[#003366] text-white shadow-blue-200" 
                />
                <StatCard 
                    label="Integridade" 
                    value="Seguro" 
                    icon={<ShieldCheck className="text-white"/>} color="bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-indigo-200" 
                />
            </section>

            {/* 2. FILTROS REESTILIZADOS */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-[3] w-full">
                    <label className="text-[10px] font-black text-[#1B365D] uppercase ml-4 mb-2 block tracking-widest opacity-70 italic">Localizar Transação (Nome, CPF, Tutor)</label>
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <Input 
                            placeholder="Ex: Rex, João Silva, Auditoria Central..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="pl-14 bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl h-16 font-bold text-[#1B365D] placeholder:text-slate-400 transition-all shadow-inner"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full lg:min-w-[240px]">
                    <label className="text-[10px] font-black text-[#1B365D] uppercase ml-4 mb-2 block tracking-widest opacity-70 italic">Período Fiscal</label>
                    <input 
                        type="date"
                        className="w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 rounded-2xl h-16 px-6 text-[#1B365D] font-black text-sm outline-none transition-all shadow-inner"
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                    />
                </div>
                <Button 
                    variant="outline" 
                    className="h-16 w-16 p-0 border-2 border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-2xl shrink-0 transition-all duration-300"
                    onClick={() => { setFiltro(""); setFiltroData(""); carregarExtrato(); }}
                >
                    <FilterX size={24} />
                </Button>
            </div>

            {/* 3. LISTAGEM TIPO "BANK STATEMENT" */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
                <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Timeline</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Origem do Recurso</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Destino Operacional</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status Auditor</th>
                                <th className="px-8 py-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Liquidação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {extratoFiltrado.map((p) => (
                                <tr key={p.id} className="hover:bg-blue-50/40 transition-all group">
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col border-l-4 border-blue-500 pl-4">
                                            <span className="text-[#1B365D] font-black text-sm">{new Date(p.dataConfirmacao).toLocaleDateString('pt-BR')}</span>
                                            <span className="text-[11px] text-slate-400 font-bold uppercase">{new Date(p.dataConfirmacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</span>
                                        </div>
                                    </td>

                                    <td className="px-8 py-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-slate-600 font-black text-xs uppercase">{p.cadastro?.tutor?.nome || 'Anonimizado'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                                                <PawPrint size={14} className="text-blue-600" />
                                                <span className="text-blue-800 font-black text-[10px] uppercase italic tracking-tighter">PET: {p.cadastro?.pet?.nomeAnimal}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-8">
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <Landmark size={14} className="text-emerald-600" />
                                                </div>
                                                <span className="text-[#1B365D] font-black text-[11px] uppercase truncate max-w-[180px]">{p.contaDestino?.nomeRecebedor}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase">Banco</span>
                                                    <span className="text-[10px] font-bold text-slate-700">{p.contaDestino?.banco}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase">Ag/Conta</span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-700">{p.contaDestino?.agencia || '0001'} / {p.contaDestino?.conta || '12345-6'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 pt-2 border-t border-slate-200/50">
                                                <span className="text-[8px] font-black text-slate-400 uppercase block">Chave PIX</span>
                                                <span className="text-[9px] font-mono text-emerald-600 font-bold truncate block">{p.contaDestino?.chave}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <UserCheck size={18} className="text-slate-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 font-black text-[10px] uppercase">{p.aprovadorNome || 'SISTEMA'}</span>
                                                <span className="text-[9px] text-emerald-500 font-black flex items-center gap-1 uppercase tracking-widest">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Validado
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-8">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-emerald-600 font-black text-xl italic tracking-tighter">R$ {p.contaDestino?.valorTaxa?.toFixed(2)}</span>
                                            <button 
                                                disabled={!p.comprovanteUrl}
                                                onClick={() => { const url = formatarUrlComprovante(p.comprovanteUrl); if(url) window.open(url, '_blank'); }}
                                                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-blue-900/10 ${
                                                    !p.comprovanteUrl 
                                                    ? 'bg-slate-100 text-slate-300' 
                                                    : 'bg-[#1B365D] text-white hover:bg-blue-800 active:scale-95'
                                                }`}
                                            >
                                                <FileText size={14} /> RECIBO
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE VIEW (APP STYLE - TOTALMENTE REFEITA) */}
                <div className="xl:hidden divide-y divide-slate-100 bg-white">
                    {extratoFiltrado.map((p) => (
                        <div key={p.id} className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                        <CalendarDays size={14} /> {new Date(p.dataConfirmacao).toLocaleDateString('pt-BR')}
                                    </div>
                                    <h3 className="text-[#1B365D] font-black text-lg leading-none uppercase italic">Pet: {p.cadastro?.pet?.nomeAnimal}</h3>
                                    <p className="text-slate-400 font-bold text-xs">Tutor: {p.cadastro?.tutor?.nome}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-600 font-black text-2xl tracking-tighter italic">R$ {p.contaDestino?.valorTaxa?.toFixed(2)}</p>
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[9px] font-black uppercase">Liquidado</span>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-[2rem] border border-slate-200 space-y-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                        <Landmark size={24} className="text-emerald-600" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Destinatário</p>
                                        <p className="text-xs font-black text-[#1B365D] truncate uppercase">{p.contaDestino?.nomeRecebedor}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Banco / Chave</p>
                                        <p className="text-[10px] font-bold text-slate-700 uppercase">{p.contaDestino?.banco}</p>
                                        <p className="text-[10px] font-mono text-emerald-600 font-bold truncate">{p.contaDestino?.chave}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Agência / Conta</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-700 uppercase">Ag: {p.contaDestino?.agencia || '0001'}</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-700 uppercase">Cc: {p.contaDestino?.conta || '12345-6'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    disabled={!p.comprovanteUrl}
                                    onClick={() => { const url = formatarUrlComprovante(p.comprovanteUrl); if(url) window.open(url, '_blank'); }}
                                    className="flex-1 h-14 rounded-2xl bg-[#1B365D] text-white font-black text-xs uppercase flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
                                >
                                    <FileText size={18} /> Ver Comprovante
                                </button>
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExtratoAuditoria;