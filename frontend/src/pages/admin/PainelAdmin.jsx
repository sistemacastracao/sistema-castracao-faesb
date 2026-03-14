import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import DashboardMaster from './DashboardMaster'; // Nome claro e direto

export default function PainelAdmin() {
    const { user } = useContext(AuthContext);

    // Mapeamento Dinâmico
    const dashboards = {
        'MASTER': <DashboardMaster />,
        'VETERINARIA': <div className="p-20">Painel Veterinário em construção...</div>,
        // Futuros níveis aqui
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {dashboards[user?.nivelAcesso] || <div className="p-20">Acesso não autorizado.</div>}
        </div>
    );
}