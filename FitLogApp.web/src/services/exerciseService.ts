import api from "./api";
import type { Exercise, CreateExerciseDto } from "../types/exercise";

export const exerciseService = {
  getAll: async () => {
    const response = await api.get<Exercise[]>("/Exercise");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Exercise>(`/Exercise/${id}`);
    return response.data;
  },

  create: async (data: CreateExerciseDto) => {
    const response = await api.post<Exercise>("/Exercise", data);
    return response.data;
  },
};