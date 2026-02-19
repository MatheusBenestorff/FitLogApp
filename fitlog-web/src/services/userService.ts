import api from "./api";

export interface UserDetailsDto {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthday: string;
}

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get<UserDetailsDto>("/User/current");
    return response.data;
  },
};