import React, { useState, useEffect } from 'react';
import { ShieldCheck, Landmark, DollarSign, Loader2, RefreshCw, Key } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

// IMPORTAÇÃO CORRETA (Baseada no erro anterior)
import StatCard from '../../components/charts/StatCard';
import { Input } from '../../components/ui/Input'; 
import { Button } from '../../components/ui/Button';

const GestaoPix = () => {
    const [pixAtivo, setPixAtivo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);
    
    const [formulario, setFormulario] = useState({
        chave: '', 
        tipoChave: 'E-MAIL', 
        nomeRecebedor: '', 
        banco: '', 
        agencia: '', 
        conta: '', 
        valorTaxa: ''
    });

    const carregarDados = async () => {
        try {
            const res = await api.get('/admin/configuracao-pix/ativa');
            if (res.data) {
                setPixAtivo(res.data);
                setFormulario({ 
                    ...res.data, 
                    valorTaxa: res.data.valorTaxa?.toString() || '' 
                });
            }
        } catch (err) {
            console.warn("Cofre vazio.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregarDados(); }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setProcessando(true);
        try {
            await api.post('/admin/configuracao-pix/cadastrar', formulario);
            toast.success("Parâmetros atualizados!");
            carregarDados();
        } catch (err) {
            toast.error("Erro ao salvar.");
        } finally {
            setProcessando(false);
        }
    };

    if (loading) return <div className="p-20 text-[#003366] font-black text-center">CARREGANDO TESOURARIA...</div>;

    return (
        <div className="space-y-8 pb-10">
            {/* STAT CARDS PADRÃO */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Repasse" 
                    value={`R$ ${pixAtivo?.valorTaxa || '0,00'}`} 
                    icon={<DollarSign />} 
                    color="text-emerald-600" 
                />
                <StatCard 
                    label="Banco" 
                    value={pixAtivo?.banco || 'N/A'} 
                    icon={<Landmark />} 
                    color="text-[#003366]" 
                />
                <StatCard 
                    label="Chave" 
                    value={pixAtivo?.tipoChave || '---'} 
                    icon={<Key />} 
                    color="text-amber-500" 
                />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* CARD DE VISUALIZAÇÃO - AZUL MARINHO PADRÃO */}
                <div className="lg:col-span-5 bg-[#003366] p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <ShieldCheck className="text-[#FFCC00] mb-4" size={32} />
                        <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest italic">Configuração no Ar</span>
                        <h2 className="text-2xl font-black italic uppercase mt-2 break-all tracking-tighter">
                            {pixAtivo?.chave || 'NENHUMA CHAVE'}
                        </h2>
                    </div>
                    <div className="relative z-10 mt-10 pt-6 border-t border-white/10">
                        <p className="text-xs font-bold uppercase italic">{pixAtivo?.nomeRecebedor}</p>
                        <p className="text-white/40 text-[10px] font-mono">{pixAtivo?.agencia} / {pixAtivo?.conta}</p>
                    </div>
                    <Landmark className="absolute -bottom-10 -right-10 text-white/[0.03]" size={250} />
                </div>

                {/* FORMULÁRIO USANDO SEUS COMPONENTES CORE */}
                <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select 
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-[#003366] font-bold text-sm"
                                value={formulario.tipoChave}
                                onChange={e => setFormulario({...formulario, tipoChave: e.target.value})}
                            >
                                <option value="E-MAIL">E-MAIL</option>
                                <option value="CPF">CPF</option>
                                <option value="CNPJ">CNPJ</option>
                                <option value="CELULAR">CELULAR</option>
                            </select>

                            <Input 
                                placeholder="Valor da Taxa"
                                type="number"
                                value={formulario.valorTaxa}
                                onChange={e => setFormulario({...formulario, valorTaxa: e.target.value})}
                            />
                        </div>

                        <Input 
                            placeholder="Chave Pix"
                            value={formulario.chave}
                            onChange={e => setFormulario({...formulario, chave: e.target.value})}
                        />

                        <Input 
                            placeholder="Nome do Recebedor"
                            value={formulario.nomeRecebedor}
                            onChange={e => setFormulario({...formulario, nomeRecebedor: e.target.value})}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <Input placeholder="Banco" value={formulario.banco} onChange={e => setFormulario({...formulario, banco: e.target.value})} />
                            <Input placeholder="Ag" value={formulario.agencia} onChange={e => setFormulario({...formulario, agencia: e.target.value})} />
                            <Input placeholder="CC" value={formulario.conta} onChange={e => setFormulario({...formulario, conta: e.target.value})} />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full">
                                {processando ? <RefreshCw className="animate-spin" /> : "SALVAR ALTERAÇÕES"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GestaoPix;