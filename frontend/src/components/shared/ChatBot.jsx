import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ChevronRight, GraduationCap, DollarSign, Stethoscope, Heart, ClipboardCheck, Instagram } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('menu'); 
    const [conteudo, setConteudo] = useState({ titulo: '', msg: '' });
    const scrollRef = useRef(null);

    const duvidas = [
        {
            id: 1,
            label: "Quem realiza os procedimentos?",
            icon: <GraduationCap size={20} className="text-blue-600" />,
            titulo: "Corpo Técnico Especializado",
            msg: "As consultas e cirurgias são realizadas por Professores Doutores e Médicos Veterinários da FAESB. Os alunos apenas acompanham para aprendizado prático, garantindo que seu pet seja atendido pelos profissionais que formam os novos médicos veterinários."
        },
        {
            id: 2,
            label: "Qual o valor e como pagar?",
            icon: <DollarSign size={20} className="text-emerald-600" />,
            titulo: "Custos Sociais da Faculdade",
            msg: "O valor pago no cadastro refere-se à consulta de avaliação. O custo do procedimento cirúrgico será definido após essa avaliação. Por ser um projeto social da FAESB, os valores são muito mais acessíveis que em clínicas particulares, mantendo a alta qualidade."
        },
        {
            id: 3,
            label: "Como finalizar o cadastro?",
            icon: <ClipboardCheck size={20} className="text-amber-600" />,
            titulo: "Passo a Passo do Cadastro",
            msg: "Preencha os dados e, ao final, realize o pagamento da consulta via PIX. É obrigatório anexar o comprovante no sistema para que sua vaga na fila seja validada pela nossa equipe administrativa."
        },
        {
            id: 4,
            label: "Por que realizar na FAESB?",
            icon: <Heart size={20} className="text-rose-600" />,
            titulo: "Excelência e Causa Social",
            msg: "Você terá acesso a doutores experientes e infraestrutura de ponta. Escolher a FAESB é apoiar um projeto social que cuida do bem-estar animal com seriedade acadêmica e preços reduzidos."
        },
        {
            id: 5,
            label: "Como é a consulta?",
            icon: <Stethoscope size={20} className="text-purple-600" />,
            titulo: "Avaliação Pré-Operatória",
            msg: "É um exame detalhado onde avaliamos se o pet está apto para a anestesia. Esse cuidado é essencial para a segurança da cirurgia e para tirar todas as suas dúvidas sobre o pós-operatório."
        }
    ];

    const abrirDuvida = (item) => {
        setConteudo({ titulo: item.titulo, msg: item.msg });
        setView('resposta');
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[999] font-sans">
            {isOpen && (
                <div className="bg-white w-[90vw] md:w-85 h-[520px] max-h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col border border-slate-200 overflow-hidden mb-4 animate-in slide-in-from-right-5">
                    
                    <div className="bg-[#1B365D] p-5 text-white flex justify-between items-center border-b-4 border-[#FFCC00]">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl">
                                <MessageCircle size={22} className="text-[#FFCC00]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-tighter opacity-70 leading-none mb-1">Dúvidas Frequentes</p>
                                <p className="font-bold text-sm tracking-tight">Suporte FAESB VET</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto bg-slate-50">
                        {view === 'menu' ? (
                            <div className="space-y-3">
                                <div className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-sm">
                                    <p className="text-xs text-slate-500 font-medium italic text-center leading-tight">
                                        "Selecione uma opção abaixo para entender como funciona nosso atendimento social."
                                    </p>
                                </div>
                                {duvidas.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => abrirDuvida(item)}
                                        className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 hover:border-[#1B365D] hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="text-[11px] font-bold text-slate-700 text-left">{item.label}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#1B365D] group-hover:translate-x-1 transition-transform" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="animate-in fade-in zoom-in-95 duration-300 h-full flex flex-col">
                                <button 
                                    onClick={() => setView('menu')}
                                    className="text-[10px] font-black text-[#1B365D] uppercase mb-4 flex items-center gap-1 hover:underline tracking-widest"
                                >
                                    ← Voltar ao menu
                                </button>
                                
                                <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm flex-1">
                                    <div className="w-10 h-1 bg-[#FFCC00] rounded-full mb-4" />
                                    <h3 className="text-[#1B365D] font-black text-sm mb-4 uppercase tracking-tight">
                                        {conteudo.titulo}
                                    </h3>
                                    <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                        {conteudo.msg}
                                    </p>
                                </div>

                                <div className="mt-4 p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3">
                                    <Instagram size={20} className="text-[#1B365D] shrink-0" />
                                    <p className="text-[9px] text-slate-500 font-bold leading-tight uppercase">
                                        Dúvidas sobre o sistema? <br/>
                                        <span className="font-medium normal-case">
                                            Nossa equipe de suporte pode te orientar via Instagram. Consultas e procedimentos seguem os valores sociais.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button 
                onClick={() => {setIsOpen(!isOpen); setView('menu');}}
                className={`bg-[#1B365D] text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-[#FFCC00] ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                <span className="hidden md:block font-black text-xs uppercase tracking-[0.2em]">Dúvidas?</span>
            </button>
        </div>
    );
};

export default ChatBot;