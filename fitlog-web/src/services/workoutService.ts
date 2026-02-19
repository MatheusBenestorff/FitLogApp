import api from "./api";
import type { Workout, CreateWorkoutDto, UpdateWorkoutDto } from "../types/workout";

export const workoutService = {
  getAll: async () => {
    const response = await api.get<Workout[]>("/Workout");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Workout>(`/Workout/${id}`);
    return response.data;
  },


  create: async (data: CreateWorkoutDto) => {
    const response = await api.post<Workout>("/Workout", data);
    return response.data;
  },

  update: async (id: number, data: UpdateWorkoutDto) => {
    const response = await api.put<Workout>(`/Workout/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/Workout/${id}`);
  }
};