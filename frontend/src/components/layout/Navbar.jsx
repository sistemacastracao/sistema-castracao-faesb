import logoFaesb from "../../assets/faesb.jpg";

export const Navbar = () => {
  return (
    <nav className="w-full bg-[#1B365D] border-b-4 border-[#FFCC00] py-3 px-6 flex justify-between items-center shadow-2xl">
      {/* Lado Esquerdo: Identidade Visual */}
      <div className="flex items-center gap-4">
        <div className="bg-white p-1.5 rounded-lg shadow-inner">
          <img src={logoFaesb} alt="Logo FAESB" className="h-12 w-auto object-contain" />
        </div>
        <div className="hidden sm:block border-l border-white/20 pl-4">
          <h1 className="text-white font-black text-xl leading-none tracking-tighter uppercase">
            FAESB
          </h1>
          <p className="text-[#FFCC00] text-[9px] uppercase font-black tracking-[0.2em] mt-1">
            Faculdade de Ensino Superior
          </p>
        </div>
      </div>

      {/* Lado Direito: Localização e Especialidade */}
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-[#FFCC00] rounded-full animate-pulse"></span>
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
            Unidade Tatuí
          </span>
        </div>
        <div className="text-right">
          <p className="text-[#FFCC00] text-[11px] font-black uppercase leading-none">
            Medicina Veterinária
          </p>
          <p className="text-white/50 text-[9px] font-medium uppercase mt-1">
            Sistema de Gestão de Castração
          </p>
        </div>
      </div>
    </nav>
  );
};