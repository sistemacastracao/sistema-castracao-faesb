import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    withCredentials: true, // Obrigatório para Cookies HttpOnly
    timeout: 10000, // 10 segundos para não travar a UI
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- INTERCEPTOR DE RESPOSTA ---
api.interceptors.response.use(
    (response) => response, // Se a resposta for OK, apenas retorna ela
    (error) => {
        // Se o servidor retornar 401 (Não autorizado), o token provavelmente expirou
        if (error.response && error.response.status === 401) {
            // Limpa o lixo do navegador para segurança
            localStorage.clear();
            sessionStorage.clear();
            
            // Só redireciona se não estivermos já na página de login (evita loop)
            if (!window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;