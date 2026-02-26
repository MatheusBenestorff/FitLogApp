import React, { type ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full mb-4">
      {/* Label */}
      {label && (
        <label className="block text-gray-300 text-sm font-medium mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Renderiza o ícone se existir */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        <input
          className={`
            w-full
            bg-navy-800 
            text-white 
            placeholder-gray-500
            border 
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-700 focus:border-brand-orange focus:ring-brand-orange/20"}
            rounded-lg
            py-3 
            ${icon ? "pl-10" : "px-4"} /* Ajusta o padding se tiver ícone */
            pr-4
            leading-tight
            outline-none
            focus:ring-4 /* Anel de brilho suave ao focar */
            transition-all duration-200 ease-in-out
            shadow-sm
            ${className}
          `}
          {...props}
        />
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <span className="text-red-400 text-xs mt-1 ml-1 block">{error}</span>
      )}
    </div>
  );
};
