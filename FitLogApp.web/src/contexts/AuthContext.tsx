import React, { createContext, useState, useContext, useEffect } from "react";
import { userService } from "../services/userService";
import type { UserDetailsDto } from "../types/user";

interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  user: UserDetailsDto | null; 
  signIn: (token: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("fitlog_token"),
  );
  
  const [user, setUser] = useState<UserDetailsDto | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("fitlog_token", token);
      
      userService.getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Erro ao carregar dados do usuário. O token pode estar expirado.", error);
          signOut(); 
        });

    } else {
      localStorage.removeItem("fitlog_token");
      setUser(null);
    }
  }, [token]);

  const signIn = (newToken: string) => {
    setToken(newToken);
  };

  const signOut = () => {
    setToken(null);
    setUser(null); 
  };

  return (
    <AuthContext.Provider
      value={{ 
        token, 
        isAuthenticated: !!token, 
        user,
        signIn, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);