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
      className={`
        w-full font-bold py-3 px-4 rounded 
        transition-transform active:scale-95
        text-black 
        ${
          props.disabled || isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-brand-orange hover:bg-orange-600"
        }
      `}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? "Entrando..." : children}
    </button>
  );
};
