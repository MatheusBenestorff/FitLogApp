import api from "./api";
import type { AuthResponse } from "../types/auth";
import type { CreateUserDto, LoginDto } from "../types/dtos";

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/User/login", credentials);
  return response.data;
};

export const register = async (data: CreateUserDto): Promise<void> => {
  await api.post("/User", data);
};
