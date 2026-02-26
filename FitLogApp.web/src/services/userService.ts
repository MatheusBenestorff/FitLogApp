import api from "./api";
import type { UserDetailsDto } from "../types/user";


export const userService = {
  getCurrentUser: async () => {
    const response = await api.get<UserDetailsDto>("/User/current");
    return response.data;
  },
};