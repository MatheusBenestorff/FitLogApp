import api from "./api";
import type { 
  WorkoutDetailsDto, 
  CreateWorkoutDto, 
  UpdateWorkoutDto, 
  WorkoutSummary 
} from "../types/workout";

export const workoutService = {
  getAll: async () => {
    const response = await api.get<WorkoutSummary[]>("/Workout");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<WorkoutDetailsDto>(`/Workout/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkoutDto) => {
    const response = await api.post<WorkoutDetailsDto>("/Workout", data);
    return response.data;
  },

  update: async (id: number, data: UpdateWorkoutDto) => {
    const response = await api.put<WorkoutDetailsDto>(`/Workout/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/Workout/${id}`);
  }
};