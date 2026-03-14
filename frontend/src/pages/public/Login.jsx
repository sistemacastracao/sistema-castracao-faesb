import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import api from '../../api/api';
import toast from 'react-hot-toast';

// Componentes UI de alto padrão
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: email.trim(),
                senha: senha.trim()
            });

            // Captura os dados estruturados do backend
            const userData = response.data.user || response.data;

            // Validação mínima de segurança
            if (!userData?.nivelAcesso) {
                throw new Error("Perfil de acesso não identificado.");
            }

            // 1. Salva no Contexto (isso atualiza o estado global e o localStorage)
            login(userData);

            // 2. Redirecionamento 100% Dinâmico
            // O Java envia 'rotaInicial'. Se por algum motivo bizarro falhar, vai para o painel.
            const destino = userData.rotaInicial || '/admin/painel';

            toast.success(`Bem-vindo, ${userData.nome}`);
            
            // 3. Navega para onde o servidor mandou
            navigate(destino);

        } catch (err) {
            const mensagem = err.response?.data?.message || err.message || "Erro na conexão.";
            toast.error(mensagem);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 font-sans">
            <div className="w-full max-w-md relative z-10">
                
                {/* Branding FAESB */}
                <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1B365D] rounded-[2rem] shadow-2xl mb-4">
                        <img src="/src/assets/faesb.jpg" alt="Logo" className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
                    </div>
                    <h2 className="text-4xl font-black text-[#1B365D] uppercase tracking-tighter italic">FAESB</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Sistema de Castração</p>
                </div>

                {/* Card de Login */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="E-mail de Acesso"
                            icon={Mail}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@faesb.edu.br"
                            required
                        />

                        <div className="relative">
                            <Input
                                label="Sua Chave de Acesso"
                                icon={Lock}
                                type={mostrarSenha ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-4 top-[38px] text-slate-400 hover:text-[#1B365D]"
                            >
                                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="secondary"
                            loading={loading}
                        >
                            Acessar Sistema
                        </Button>
                    </form>
                </div>

                <footer className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Tecnologia de Gestão FAESB <br />
                    <span className="text-[#1B365D]">Unidade Tatuí • 2026</span>
                </footer>
            </div>
        </div>
    );
};

export default Login;