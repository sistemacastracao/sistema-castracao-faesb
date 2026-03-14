import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const StatusPieChart = ({ approved, pending }) => {
    const data = [
        { name: 'Aprovados', value: approved || 0 },
        { name: 'Pendentes', value: pending || 0 },
    ];

    const COLORS = ['#10B981', '#FFCC00'];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group min-h-[400px]">
            {/* 🛡️ Marca d'água de Proteção */}
            <div className="absolute -bottom-10 -left-10 text-slate-100/50 transition-all duration-1000 group-hover:rotate-12 group-hover:text-emerald-500/5 pointer-events-none">
                <ShieldCheck size={240} strokeWidth={0.5} />
            </div>

            <div className="w-full flex items-center justify-between mb-8 relative z-10 text-left">
                <div>
                    <h3 className="text-xl font-black text-[#003366] uppercase italic tracking-tighter">Aprovações</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status dos Cadastros</p>
                </div>
                <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={20} />
                </div>
            </div>

            {/* Ajuste de estabilidade: h-[280px] e minWidth={0} */}
            <div className="h-[280px] min-h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                        <Pie 
                            data={data} 
                            innerRadius={75} 
                            outerRadius={100} 
                            paddingAngle={10} 
                            dataKey="value"
                            stroke="none"
                            // Adicionada animação suave para evitar saltos visuais
                            animationBegin={0}
                            animationDuration={1200}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                            }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            iconType="circle" 
                            formatter={(value) => (
                                <span className="text-[#003366] font-black italic text-[11px] uppercase ml-2">
                                    {value}
                                </span>
                            )}
                            wrapperStyle={{paddingTop: '20px'}}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatusPieChart;