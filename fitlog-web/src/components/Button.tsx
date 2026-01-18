import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  ...props
}) => {
  return (
    <button
      className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors
        ${
          props.disabled || isLoading
            ? "bg-gray-500 cursor-not-allowed text-gray-300"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
};
