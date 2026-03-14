import React from 'react';

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative text-left min-h-[110px]">
        <div className="flex items-center gap-4 relative z-10">
            {/* Box do Ícone Pequeno */}
            <div className={`p-4 rounded-2xl bg-slate-50 ${color} group-hover:bg-white group-hover:shadow-lg transition-all duration-500 flex items-center justify-center`}>
                {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">{label}</p>
                <h3 className="text-2xl font-black text-[#003366] italic tracking-tighter leading-tight">
                    {value}
                </h3>
            </div>
        </div>

        {/* 🎨 Marca d'água Gigante no fundo */}
        <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:-rotate-12 transition-all duration-700 pointer-events-none ${color}`}>
            {React.cloneElement(icon, { size: 140, strokeWidth: 1.5 })}
        </div>
    </div>
);

export default StatCard;