export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', // Nova prop para dinamismo de tamanho
  loading, 
  type = 'button',  // Define o tipo dinamicamente (padrão 'button')
  icon: Icon,       // Permite passar um ícone opcional
  ...props 
}) => {
  
  const variants = {
    primary: 'bg-[#2D5A27] hover:bg-[#23451e] text-white shadow-lg shadow-green-900/20',
    secondary: 'bg-[#1B365D] hover:bg-[#12243d] text-white shadow-lg shadow-blue-900/20',
    outline: 'border-2 border-gray-300 text-gray-600 hover:bg-gray-50'
  };

  const sizes = {
    default: 'py-4 px-6 text-xs',
    sm: 'py-2 px-4 text-[10px]', // Útil para botões secundários ou mobile
    lg: 'py-5 px-8 text-sm',      // Útil para call-to-actions principais
  };

  return (
    <button 
      {...props}
      type={type}
      disabled={loading || props.disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        w-full 
        rounded-2xl 
        font-black 
        uppercase 
        tracking-widest 
        transition-all 
        active:scale-[0.98] 
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        /* Ajuste Responsivo: No mobile o texto é um pouco maior para leitura rápida */
        md:tracking-[0.2em]
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={16} className={loading ? 'hidden' : 'block'} />}
          {children}
        </>
      )}
    </button>
  );
};