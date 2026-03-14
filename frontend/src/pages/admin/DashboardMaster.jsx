import React, { useState, useEffect } from 'react';
import { PawPrint, Users, BadgeDollarSign, Activity, Loader2, Power, ShieldCheck, Smile, Frown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import toast from 'react-hot-toast';

import StatCard from '../../components/charts/StatCard';
import SpeciesChart from '../../components/charts/SpeciesChart';
import StatusPieChart from '../../components/charts/StatusPieChart';
import FinanceAreaChart from '../../components/charts/FinanceAreaChart';

const DashboardMaster = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vagasAbertas, setVagasAbertas] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    // ESTA É A CHAVE: Garante que o gráfico só apareça após o layout estar 100% pronto
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [response, statusRes] = await Promise.all([
                    api.get('/admin/dashboard-summary'),
                    api.get('/sistema/status')
                ]);
                setData(response.data);
                setVagasAbertas(statusRes.data.cadastroAberto);
            } catch (error) {
                toast.error("Erro ao sincronizar dados.");
            } finally {
                setLoading(false);
                // Pequeno delay após o loading sumir para o layout estabilizar
                setTimeout(() => setIsMounted(true), 200);
            }
        };
        fetchDashboardData();
    }, []);

    const handleToggleVagas = async () => {
        if (toggleLoading) return;
        setToggleLoading(true);
        try {
            const novoStatus = !vagasAbertas;
            await api.patch('/sistema/admin/toggle', { aberto: novoStatus });
            setVagasAbertas(novoStatus);
            toast.success(`Inscrições ${novoStatus ? 'Liberadas' : 'Pausadas'}`);
        } catch (err) {
            toast.error("Erro ao alterar status das inscrições.");
        } finally {
            setToggleLoading(false);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center text-[#003366] font-black animate-pulse">
            <Loader2 className="animate-spin mr-3" size={32} /> CARREGANDO PAINEL...
        </div>
    );

    const especies = data?.distribuicaoEspecies || [];
    const dogsCount = especies.find(e => e.name === 'CACHORRO')?.value || 0;
    const catsCount = especies.find(e => e.name === 'GATO')?.value || 0;
    const financialData = data?.fluxoFinanceiro || [];

    return (
        <div className="space-y-8 pb-10">
            {/* --- HEADER (BOTÃO VOLTOU AQUI) --- */}
            <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-[#003366] p-3 rounded-2xl shadow-lg shadow-blue-900/20">
                        <ShieldCheck className="text-[#FFCC00]" size={28} />
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl font-black text-[#003366] uppercase italic leading-none tracking-tighter">Dashboard Master</h1>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Gestão de Fluxo FAESB</p>
                    </div>
                </div>

                <div className={`flex items-center gap-4 p-2 pr-6 rounded-full border transition-all duration-500 bg-white shadow-inner ${vagasAbertas ? 'border-emerald-100' : 'border-slate-100'}`}>
                    <motion.button 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={handleToggleVagas} 
                        disabled={toggleLoading}
                        whileTap={{ scale: 0.95 }}
                        animate={{ backgroundColor: vagasAbertas ? '#10b981' : '#94a3b8' }}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg relative outline-none border-none cursor-pointer"
                    >
                        <AnimatePresence mode="wait">
                            {toggleLoading ? (
                                <motion.div key="loader" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Loader2 size={24} />
                                </motion.div>
                            ) : isHovered ? (
                                <motion.div key="humor" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                                    {vagasAbertas ? <Smile size={30} /> : <Frown size={30} />}
                                </motion.div>
                            ) : (
                                <motion.div key="power" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                                    <Power size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    
                    <div className="text-left">
                        <p className="text-[9px] font-black uppercase text-slate-400">Status de Inscrições</p>
                        <p className={`text-xs font-black uppercase tracking-tight ${vagasAbertas ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {vagasAbertas ? 'Sistema Aberto' : 'Sistema Pausado'}
                        </p>
                    </div>
                </div>
            </header>

            {/* --- STAT CARDS --- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total de Pets" value={data?.totalPets || 0} icon={<PawPrint />} color="text-blue-600" />
                <StatCard label="Tutores Ativos" value={data?.tutoresAtivos || 0} icon={<Users />} color="text-indigo-600" />
                <StatCard label="Receita Total" value={`R$ ${data?.arrecadacaoTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={<BadgeDollarSign />} color="text-emerald-600" />
                <StatCard label="Pendentes" value={data?.aguardandoConfirmacao || 0} icon={<Activity />} color="text-amber-500" />
            </section>

            {/* --- GRÁFICOS (PROTEGIDOS POR isMounted) --- */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {isMounted ? (
                    <>
                        <SpeciesChart dogs={dogsCount} cats={catsCount} />
                        <StatusPieChart approved={data?.pagamentosAprovados || 0} pending={data?.aguardandoConfirmacao || 0} />
                    </>
                ) : <div className="h-[400px] col-span-2" />}
            </section>

            <section className="w-full">
                {isMounted ? (
                    <FinanceAreaChart data={financialData} />
                ) : <div className="h-[450px] w-full" />}
            </section>
        </div>
    );
};

export default DashboardMaster;