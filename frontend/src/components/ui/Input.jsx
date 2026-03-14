import * as masks from '../../utils/masks';

export const Input = ({ label, icon: Icon, mask, onChange, ...props }) => {
  
  const handleChange = (e) => {
    if (!onChange) return;

    let { value } = e.target;

    // Lógica Dinâmica de Máscara
    if (mask) {
      // Padroniza: se passar mask="cpf", vira "maskCPF"
      const formattedMaskName = `mask${mask.toUpperCase()}`;
      if (masks[formattedMaskName]) {
        value = masks[formattedMaskName](value);
      }
    }

    // Retorna o evento limpo para o formulário
    onChange({
      ...e,
      target: {
        ...e.target,
        name: props.name,
        value: value
      }
    });
  };

  // Define o tipo de teclado (inputMode) baseado na máscara para facilitar no celular
  const getInputMode = () => {
    if (mask === 'CPF' || mask === 'PHONE' || mask === 'CEP') return 'numeric';
    if (props.type === 'email') return 'email';
    return 'text';
  };

  return (
    <div className="w-full group">
      {label && (
        <label className="block text-[10px] md:text-[11px] font-black text-[#1B365D] uppercase tracking-tighter mb-1 ml-1 transition-colors group-focus-within:text-[#2D5A27]">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#2D5A27]" 
            size={18} 
          />
        )}
        
        <input 
          {...props}
          inputMode={getInputMode()} // Abre teclado numérico automaticamente se for CPF/Tel
          onChange={handleChange}
          className={`
            w-full bg-slate-50 border-2 border-slate-200 
            ${Icon ? 'pl-10' : 'px-4'} 
            py-3.5 md:py-3 
            rounded-xl outline-none 
            focus:border-[#2D5A27] focus:bg-white 
            transition-all font-semibold text-[#1B365D] 
            placeholder:text-slate-300 
            text-base md:text-sm
          `}
          /* text-base (16px) no mobile evita o zoom automático do iPhone.
             py-3.5 aumenta a área de toque no celular.
          */
        />
      </div>
    </div>
  );
};