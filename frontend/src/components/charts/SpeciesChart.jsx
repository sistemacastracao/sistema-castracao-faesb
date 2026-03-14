import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PawPrint, Dog, Cat } from 'lucide-react';

const SpeciesChart = ({ dogs, cats }) => {
    const data = [
        { name: 'Cachorros', value: dogs || 0 },
        { name: 'Gatos', value: cats || 0 },
    ];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group min-h-[400px]">
            {/* 🐾 Marca d'água Dinâmica */}
            <div className="absolute -bottom-10 -right-10 text-slate-100/50 transition-all duration-1000 group-hover:scale-110 group-hover:text-[#FFCC00]/10 pointer-events-none">
                <div className="flex items-end gap-0">
                    <Cat size={160} strokeWidth={0.5} />
                    <Dog size={220} strokeWidth={0.5} className="-ml-10 -mb-5"/>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10 text-left">
                <div>
                    <h3 className="text-xl font-black text-[#003366] uppercase italic tracking-tighter">Espécies</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cães vs Gatos</p>
                </div>
                <div className="bg-[#003366] p-2.5 rounded-xl text-[#FFCC00] shadow-lg shadow-blue-900/20">
                    <PawPrint size={20} />
                </div>
            </div>

            {/* Ajuste: h-[280px] fixo e min-h para o container interno */}
            <div className="h-[280px] min-h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fontWeight: '900', fill: '#64748b'}}
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#cbd5e1'}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc', radius: 15}}
                            contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                        />
                        <Bar dataKey="value" radius={[15, 15, 5, 5]} barSize={55} isAnimationActive={true}>
                            <Cell fill="#003366" />
                            <Cell fill="#FFCC00" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpeciesChart;