import React from 'react';
import { 
    ComposedChart, 
    Bar, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend,
    Cell
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const FinanceComposedChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-full">
            
            {/* Header do Gráfico */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#003366] mb-1">
                        <TrendingUp size={20} strokeWidth={3} />
                        <h3 className="font-black uppercase italic text-sm tracking-tight">Performance Financeira</h3>
                    </div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-7">
                        Volume de Recebimento vs. Expectativa
                    </p>
                </div>
                
                <div className="hidden sm:flex gap-4">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Status Atual</p>
                        <p className="text-xs font-black text-emerald-600 uppercase italic">Em Crescimento</p>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        
                        <XAxis 
                            dataKey="mes" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fontWeight: '800', fill: '#64748b' }} 
                            dy={10}
                        />
                        
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                            tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                        />

                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        />

                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="rect"
                            wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', fontWeight: '900' }}
                        />

                        {/* Barras: Representam o montante real (Aprovado) */}
                        <Bar 
                            name="Receita Aprovada" 
                            dataKey="totalAprovado" 
                            barSize={35} 
                            radius={[6, 6, 0, 0]}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#003366' : '#10b981'} />
                            ))}
                        </Bar>

                        {/* Linha: Representa o que está pendente (Tendência/Alerta) */}
                        <Line 
                            name="Volume Pendente"
                            type="monotone" 
                            dataKey="totalPendente" 
                            stroke="#FFCC00" 
                            strokeWidth={4}
                            dot={{ r: 4, fill: '#FFCC00', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Footer com Insight rápido */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase italic">
                    Dados atualizados em tempo real
                </span>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <div className="w-2 h-2 rounded-full bg-[#003366]"></div>
                </div>
            </div>
        </div>
    );
};

export default FinanceComposedChart;