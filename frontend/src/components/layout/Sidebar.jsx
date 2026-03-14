import React, { useContext } from 'react'; // 1. Importar o useContext
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // 2. Importar o seu contexto (verifique se o caminho está certo)
import { 
    LayoutDashboard, BadgeDollarSign, ClipboardList, 
    Settings2, LogOut, X, ShieldCheck, History 
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => { // 3. Remover o 'logout' das props
    const navigate = useNavigate();
    const location = useLocation();
    
    // 4. Buscar a função de logout direto do contexto global
    const { logout } = useContext(AuthContext);

    const menuItems = [
        { 
            icon: <LayoutDashboard size={22} />, 
            label: 'Dashboard', 
            path: '/admin/painel' 
        },
        { 
            icon: <BadgeDollarSign size={22} />, 
            label: 'Fila de Pagamentos', 
            path: '/admin/pagamentos/pendentes' 
        },
        { 
            icon: <History size={22} />, 
            label: 'Extrato Auditoria', 
            path: '/admin/pagamentos/extrato' 
        },
        { 
            icon: <Settings2 size={22} />, 
            label: 'Configuração PIX', 
            path: '/admin/configuracao-pix' 
        },
    ];

    const handleNav = (path) => {
        navigate(path);
        setIsOpen(false); 
    };

    return (
        <>
            {/* MOBILE: Menu Top-Down */}
            <div className={`
                fixed inset-0 z-[100] bg-[#003366] transition-all duration-500 ease-in-out lg:hidden
                ${isOpen ? 'translate-y-0' : '-translate-y-full'}
            `}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={30} className="text-[#FFCC00]" />
                            <span className="text-white font-black italic text-xl uppercase tracking-tighter">FAESB LITE</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-[#FFCC00] p-3 bg-white/5 rounded-2xl">
                            <X size={28} />
                        </button>
                    </div>

                    <nav className="space-y-3 flex-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] font-black italic uppercase transition-all ${
                                    location.pathname === item.path ? 'bg-[#FFCC00] text-[#003366]' : 'text-white border border-white/5 bg-white/5'
                                }`}
                            >
                                <span>{item.label}</span>
                                {item.icon}
                            </button>
                        ))}
                    </nav>

                    {/* Chamada do Logout no Mobile */}
                    <button onClick={logout} className="w-full p-6 text-red-400 font-black uppercase italic flex items-center justify-center gap-3 bg-red-500/5 rounded-[1.5rem] mt-4">
                        <LogOut size={22} /> Sair do Sistema
                    </button>
                </div>
            </div>

            {/* DESKTOP: Sidebar Lateral */}
            <aside className="hidden lg:flex flex-col w-72 bg-[#003366] h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50">
                <div className="h-24 flex items-center px-8 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FFCC00] rounded-xl shadow-lg shadow-yellow-500/20">
                            <ShieldCheck size={24} className="text-[#003366]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black italic text-xl tracking-tighter uppercase">FAESB</span>
                            <span className="text-[8px] text-blue-300 font-bold uppercase tracking-[0.4em]">Master Admin</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                                    isActive 
                                    ? 'bg-[#FFCC00] text-[#003366] shadow-xl shadow-yellow-500/10 scale-[1.02]' 
                                    : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <div className={isActive ? 'text-[#003366]' : 'text-[#FFCC00] opacity-70'}>
                                    {item.icon}
                                </div>
                                <span className="font-black text-[10px] text-left uppercase italic tracking-widest leading-tight">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6">
                    {/* Chamada do Logout no Desktop */}
                    <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all group">
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black text-xs uppercase italic">Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;