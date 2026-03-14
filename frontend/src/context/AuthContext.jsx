import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Recupera apenas dados de exibição/perfil
        const recoveredUser = localStorage.getItem('@FAESB:user_profile');

        if (recoveredUser) {
            try {
                setUser(JSON.parse(recoveredUser));
            } catch (e) {
                localStorage.removeItem('@FAESB:user_profile');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Armazena apenas o necessário para a UI (id, nome, nivelAcesso)
        localStorage.setItem('@FAESB:user_profile', JSON.stringify(userData));
        setUser(userData);
    };

  const logout = async () => {
    // 1. PRIMEIRO: Limpa o estado local para o React "desmontar" as páginas protegidas
    setUser(null);
    localStorage.removeItem('@FAESB:user_profile');

    try {
        // 2. DEPOIS: Avisa o servidor para matar o cookie
        // Usamos um timeout curto ou catch para o front não travar se o back demorar
        await api.post('/auth/logout', {}, { timeout: 2000 }).catch(() => {
            console.log("Servidor demorou, limpando apenas o cliente.");
        });
    } finally {
        // 3. POR FIM: Limpeza bruta e redirecionamento para o caminho real do login
        localStorage.clear();
        sessionStorage.clear();
        
        // Use window.location.replace para ele não conseguir voltar com o botão do navegador
        window.location.replace('/admin/login'); 
    }
};

    return (
        <AuthContext.Provider value={{ 
            authenticated: !!user, 
            user, 
            login, 
            logout, 
            loading,
            isAdmin: user?.nivelAcesso === 'MASTER' // Helper para facilitar
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};