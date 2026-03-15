import { Mail, MapPin, Phone, Instagram, ExternalLink } from 'lucide-react';
import logoFaesb from "../../assets/faesb.jpg";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#1B365D] text-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-blue-900/50 pb-10">
        
        {/* Coluna 1: Logo e Descrição */}
        <div className="space-y-4">
          <img src={logoFaesb} alt="FAESB" className="h-14 bg-white p-2 rounded-lg" />
          <p className="text-xs text-blue-100 leading-relaxed font-medium">
            Polo FAESB Tatuí - Excelência em Medicina Veterinária. 
            Compromisso com o bem-estar animal e a formação profissional de qualidade.
          </p>
        </div>

        {/* Coluna 2: Contato Rápido */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#FFCC00]">Atendimento</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#FFCC00]" />
              <span>(15) 3251-0077</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#FFCC00]" />
              <a href="mailto:sistemacastraca@gmail.com" className="hover:underline">sistemacastraca@gmail.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram size={16} className="text-[#FFCC00]" />
              <a href="https://www.instagram.com/faesbtatuisp/" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                @faesbtatuisp <ExternalLink size={10} />
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Localização */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#FFCC00]">Localização</h3>
          <div className="flex items-start gap-3 text-xs leading-relaxed">
            <MapPin size={18} className="text-[#FFCC00] shrink-0" />
            <p>
              R. Onze de Agosto, 2900<br />
              Jardim Lucila, Tatuí - SP<br />
              CEP: 18277-000
            </p>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-blue-300 font-bold uppercase tracking-widest">
        <span>© 2026 FAESB - Todos os direitos reservados</span>
        <span className="mt-2 md:mt-0 italic">Sistema de Castração Lite v1.0</span>
      </div>
    </footer>
  );
};