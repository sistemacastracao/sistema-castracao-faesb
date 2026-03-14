import React, { useContext, useEffect, useState } from 'react';
import { Menu, ChevronDown, ShieldCheck } from 'lucide-react'; // Adicionei o ShieldCheck
import { AuthContext } from '../../context/AuthContext'; 

const Header = ({ setIsOpen }) => {
    const { user } = useContext(AuthContext);
    const [localName, setLocalName] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('@FAESB:user_profile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setLocalName(parsed.nome);
        }
    }, [user]);

    const displayName = user?.nome || localName || 'Polo Tatuí';

    return (
        /* USANDO O AZUL OFICIAL #003366 E O BACKDROP BLUR DO ADMINHEADER */
        <header className="h-24 bg-[#003366] border-b border-white/10 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 backdrop-blur-xl">
            
            {/* LADO ESQUERDO: LOGO IDENTICO AO ADMINHEADER */}
            <div className="flex items-center gap-3 group">
                <div className="bg-white/5 p-2 rounded-2xl border border-white/10 group-hover:border-[#FFCC00]/50 transition-all duration-500">
                    <ShieldCheck size={26} className="text-[#FFCC00]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-black italic text-2xl uppercase tracking-tighter leading-none">FAESB</span>
                    <span className="text-[8px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-0.5">Sistema Clínico</span>
                </div>
                {/* Botão Hambúrguer para Mobile dentro do bloco da logo */}
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="lg:hidden ml-4 p-2 bg-white/5 text-white rounded-xl border border-white/10"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* LADO DIREITO: INFO DO USUÁRIO IDENTICO AO MASTERHEADER */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-white leading-tight uppercase italic transition-colors">
                        {displayName}
                    </p>
                    <p className="text-[9px] text-blue-300 uppercase font-black tracking-[0.1em]">
                        Administrador Master
                    </p>
                </div>

                {/* AVATAR COM O ESTILO DO ADMINHEADER */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#FFCC00] border-2 border-white/10 hover:border-[#FFCC00] transition-all shadow-lg">
                        <span className="text-sm font-black">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-white/10 mx-1 hidden md:block"></div>
                    
                    <button className="p-1 hover:bg-white/5 rounded-full transition-colors group">
                        <ChevronDown size={18} className="text-white/20 group-hover:text-[#FFCC00] transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;