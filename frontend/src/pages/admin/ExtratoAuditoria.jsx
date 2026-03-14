import React, { useState, useEffect } from 'react';
import { 
    Search, RefreshCw, BarChart3, Clock, 
    PawPrint, CalendarDays, FileText, 
    UserCheck, Banknote, FilterX, Landmark,
    ShieldCheck, Hash, ArrowRightLeft
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
        const matchTexto = 
            (p.cadastro?.pet?.nomeAnimal || "").toLowerCase().includes(termo) ||
            (p.aprovadorNome || p.aprovadoPor?.nome || "").toLowerCase().includes(termo) ||
            (p.contaDestino?.nomeRecebedor || "").toLowerCase().includes(termo);
        
        const matchData = filtroData === "" || dataPagamento === filtroData;
        return matchTexto && matchData;
    });

    const totalProcessado = extratoFiltrado.reduce((acc, curr) => acc + (curr.contaDestino?.valorTaxa || 0), 0);

    if (loading && extrato.length === 0) return (
        <div className="flex h-96 flex-col items-center justify-center text-[#003366] font-black animate-pulse">
            <RefreshCw className="animate-spin mb-4" size={40} />
            <span className="tracking-[0.3em] text-xs uppercase">Rastreando Auditoria...</span>
        </div>
    );

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-700 px-2 md:px-0">
            
            {/* 1. DASHBOARD DE RESUMO */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    label="Volume Auditado" 
                    value={`R$ ${totalProcessado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                    icon={<Banknote />} color="text-emerald-600" 
                />
                <StatCard 
                    label="Operações" 
                    value={extratoFiltrado.length.toString()} 
                    icon={<BarChart3 />} color="text-[#003366]" 
                />
                <StatCard 
                    label="Status do Sistema" 
                    value="Seguro" 
                    icon={<ShieldCheck />} color="text-blue-500" 
                />
            </section>

            {/* 2. BARRA DE FERRAMENTAS - PROPORÇÕES CORRIGIDAS */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-[3] w-full"> {/* Busca agora ocupa 3x mais espaço */}
                    <label className="text-[10px] font-black text-[#003366] uppercase ml-2 mb-1 block italic opacity-60 italic tracking-widest">Busca Global (Pet, Aprovador, Destinatário)</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <Input 
                            placeholder="Digite qualquer termo para filtrar a lista..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="pl-12 bg-slate-50 border-none rounded-2xl h-14"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full md:min-w-[200px]">
                    <label className="text-[10px] font-black text-[#003366] uppercase ml-2 mb-1 block italic opacity-60 italic tracking-widest">Data Fluxo</label>
                    <input 
                        type="date"
                        className="w-full bg-slate-50 border-none rounded-2xl h-14 px-4 text-[#003366] font-bold text-sm outline-none focus:ring-2 focus:ring-[#003366]/10"
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                    />
                </div>
                <Button 
                    variant="outline" 
                    className="h-14 w-14 p-0 border-2 border-slate-100 text-slate-400 hover:bg-slate-50 rounded-2xl shrink-0"
                    onClick={() => { setFiltro(""); setFiltroData(""); carregarExtrato(); }}
                >
                    <FilterX size={20} />
                </Button>
            </div>

            {/* 3. LISTAGEM TIPO AUDITORIA */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#003366] text-white">
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] italic">Timeline / Ref</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] italic">Paciente (Origem)</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] italic">Auditor / Método</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] italic">Conta Destino</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] italic">Liquidação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {extratoFiltrado.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CalendarDays size={14} className="text-slate-400" />
                                                <span className="text-[#003366] font-black text-sm">{new Date(p.dataConfirmacao).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                                <Clock size={10} /> {new Date(p.dataConfirmacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <PawPrint size={15} className="text-blue-500" />
                                                <span className="text-[#003366] font-black uppercase text-sm italic tracking-tighter">{p.cadastro?.pet?.nomeAnimal || '---'}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-slate-300 mt-1 uppercase font-bold">ID: #{p.cadastro?.id?.toString().slice(-6)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <UserCheck size={14} className={p.aprovadoPor ? 'text-emerald-500' : 'text-amber-500'} />
                                                <span className="text-[#003366] font-black text-xs uppercase italic truncate max-w-[150px]">{p.aprovadorNome || p.aprovadoPor?.nome || 'Liquidação Central'}</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">
                                                {p.aprovadoPor ? 'Aprovação Manual' : 'Processamento Via API'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Landmark size={12} className="text-slate-400" />
                                                <span className="text-[#003366] font-black text-[10px] uppercase truncate max-w-[180px]">{p.contaDestino?.nomeRecebedor || 'CONTA PADRÃO'}</span>
                                            </div>
                                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md self-start border border-slate-100 italic">
                                                {p.contaDestino?.banco} • {p.contaDestino?.chave?.slice(0, 10)}...
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center">
                                            <span className="text-emerald-600 font-black text-lg tracking-tighter italic mb-2">R$ {p.contaDestino?.valorTaxa?.toFixed(2) || "0.00"}</span>
                                            <button 
                                                disabled={!p.comprovanteUrl}
                                                onClick={() => { const url = formatarUrlComprovante(p.comprovanteUrl); if(url) window.open(url, '_blank'); }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                                                    !p.comprovanteUrl 
                                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' 
                                                    : 'bg-[#003366] text-white hover:bg-blue-900 shadow-md shadow-blue-900/10'
                                                }`}
                                            >
                                                <FileText size={12} /> {p.comprovanteUrl ? 'Conferir Comprovante' : 'Sem Doc'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE VIEW CORRIGIDA (DADOS COMPLETOS) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {extratoFiltrado.map((p) => (
                        <div key={p.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="bg-slate-100 px-3 py-1 rounded-lg text-[#003366]">
                                    <p className="text-[10px] font-black italic">{new Date(p.dataConfirmacao).toLocaleDateString('pt-BR')}</p>
                                    <p className="text-[8px] font-bold opacity-60 uppercase">{new Date(p.dataConfirmacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Valor Liquidação</p>
                                    <p className="text-emerald-600 font-black text-xl italic">R$ {p.contaDestino?.valorTaxa?.toFixed(2) || "0.00"}</p>
                                </div>
                            </div>

                            <div className="space-y-3 bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase italic">Pet / Cadastro</span>
                                    <span className="text-[#003366] font-black text-xs uppercase italic">{p.cadastro?.pet?.nomeAnimal || '---'} (#{p.cadastro?.id})</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase italic">Auditoria</span>
                                    <span className="text-[#003366] font-bold text-[11px] uppercase truncate ml-4">{p.aprovadorNome || p.aprovadoPor?.nome || 'Central'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase italic">Conta Destino</span>
                                    <span className="text-[#003366] font-black text-[10px] uppercase">{p.contaDestino?.nomeRecebedor || 'CONTA PADRÃO'}</span>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase">{p.contaDestino?.banco} • {p.contaDestino?.chave?.slice(0, 15)}...</span>
                                </div>
                            </div>

                            <Button 
                                disabled={!p.comprovanteUrl}
                                onClick={() => { const url = formatarUrlComprovante(p.comprovanteUrl); if(url) window.open(url, '_blank'); }}
                                className={`w-full h-12 rounded-2xl font-black text-xs uppercase gap-3 shadow-none ${
                                    !p.comprovanteUrl ? 'bg-slate-100 text-slate-300' : 'bg-[#003366] text-white'
                                }`}
                            >
                                <FileText size={16} /> {p.comprovanteUrl ? 'Visualizar Comprovante' : 'Documento Indisponível'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExtratoAuditoria;