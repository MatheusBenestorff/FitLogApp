import api from "./api";
import type { SessionDetailsDto } from "../types/session";

export const sessionService = {
  getAllByUser: async () => {
    const response = await api.get<SessionDetailsDto[]>("/WorkoutSession"); 
    return response.data;
  },
};