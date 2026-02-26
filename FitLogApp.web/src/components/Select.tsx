import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-gray-300 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className="
                w-full 
                bg-navy-800 
                text-white 
                border-b-2 border-transparent focus:border-brand-orange
                rounded 
                py-3 px-4 
                leading-tight 
                focus:outline-none 
                appearance-none
                placeholder-gray-400
            "
          {...props}
        >
          <option value="" disabled selected>
            Selecione...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
