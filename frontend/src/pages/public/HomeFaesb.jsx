import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import CadastroTutor from './CadastroTutor';
import ChatBot from '../../components/shared/ChatBot';
import {
    Clock, Instagram, Mail, ShieldCheck,
    Loader2, BellRing, MapPin, GraduationCap
} from 'lucide-react';

const HomeFaesb = () => {
    const [status, setStatus] = useState({ aberto: false, mensagem: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checarStatus = async () => {
            try {
                const res = await api.get('/sistema/status');
                setStatus({
                    aberto: res.data.cadastroAberto,
                    mensagem: res.data.mensagemFechado
                });
            } catch (e) {
                console.error("Erro ao buscar status");
            } finally {
                setLoading(false);
            }
        };
        checarStatus();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#003366] mb-4" size={48} />
            <span className="text-[#003366] font-black tracking-widest text-xs uppercase animate-pulse">
                Carregando Portal...
            </span>
        </div>
    );

    if (status.aberto) return <CadastroTutor />;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

            {/* TOPO - IDENTIDADE DIRETA */}
            <div className="bg-[#003366] text-white py-3 px-6 text-center text-xs font-black uppercase tracking-[0.3em] border-b-4 border-[#FFCC00]">
                Medicina Veterinária - FAESB Tatuí
            </div>

            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                <GraduationCap className="absolute -bottom-20 -right-20 text-slate-200/50" size={500} />

                <div className="max-w-3xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,51,102,0.1)] border border-slate-100 overflow-hidden relative z-10">

                    <div className="bg-slate-50 p-8 border-b border-slate-100 flex flex-col items-center text-center">
                        <div className="bg-[#003366] p-4 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
                            <BellRing size={32} className="text-[#FFCC00]" />
                        </div>
                        <h1 className="text-[#003366] font-black text-2xl md:text-3xl tracking-tight uppercase">
                            Aviso de Inscrições
                        </h1>
                        <div className="h-1 w-20 bg-[#FFCC00] mt-2 rounded-full" />
                    </div>

                    <div className="p-8 md:p-12 text-center">
                        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full mb-8 border border-amber-100 font-bold text-[10px] uppercase tracking-widest">
                            <Clock size={14} className="animate-pulse" />
                            Portal de Agendamento Suspenso
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 italic tracking-tighter leading-none">
                            VAGAS EM <span className="text-[#003366]">BREVE</span>
                        </h2>

                        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem]">
                            <p className="text-lg md:text-xl text-slate-600 font-medium italic leading-relaxed">
                                "{status.mensagem || (
                                    <>
                                        O cadastro para consulta pré-castração não está disponível por esse canal nesse momento.
                                        Aguarde, em breve teremos vagas para novos cadastros. <br /><br />
                                        Obrigado. Atenciosamente, <br />
                                        <span className="text-[#003366] font-bold not-italic">Equipe Medicina Veterinária FAESB Tatuí</span>
                                    </>
                                )}"
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-100 bg-slate-50/50">
                        <div className="p-6 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100">
                            <MapPin size={24} className="text-[#003366]" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-tighter">Hospital Veterinário</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Unidade Tatuí - SP</p>
                            </div>
                        </div>
                        <div className="p-6 flex items-center gap-4">
                            <ShieldCheck size={24} className="text-emerald-600" />
                            <div>
                                <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-tighter">Projeto Social</h4>
                                <p className="text-[11px] text-slate-500 font-medium italic">Controle Populacional Animal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* RODAPÉ ATUALIZADO */}
            <footer className="p-10 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <p className="text-[12px] font-black text-[#003366] uppercase tracking-[0.2em] mb-1">
                            FAESB - Faculdade de Tatuí
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Núcleo de Medicina Veterinária
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex gap-3 mb-2">
                                <a href="#" className="p-2 bg-slate-100 rounded-lg text-[#003366] hover:bg-[#FFCC00] transition-all"><Instagram size={18} /></a>
                                <a href="#" className="p-2 bg-slate-100 rounded-lg text-[#003366] hover:bg-[#FFCC00] transition-all"><Mail size={18} /></a>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium">© 2026 Todos os direitos reservados</p>
                        </div>
                    </div>
                </div>
            </footer>
            <ChatBot />
        </div>
    );
};

export default HomeFaesb;