import api from "./api";
import type { Exercise } from "../types/exercise";

export const exerciseService = {
  getAll: async () => {
    const response = await api.get<Exercise[]>("/Exercise");
    return response.data;
  },
};