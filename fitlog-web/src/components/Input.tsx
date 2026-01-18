import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-gray-300 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        className="
            w-full 
            bg-navy-800 
            text-white 
            placeholder-[#AAAAAA] 
            border-b-2 border-transparent focus:border-brand-orange
            rounded 
            py-3 px-4 
            leading-tight 
            focus:outline-none 
            transition-colors
        "
        {...props}
      />
    </div>
  );
};
