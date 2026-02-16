import type { Exercise } from "../types/exercise";
  
  export interface Workout {
    id: number;
    name: string;
    userId: number;
    exercises: Exercise[]; 
  }
  
  export interface CreateWorkoutDto {
    name: string;
    exerciseIds: number[];
  }
  
  export interface UpdateWorkoutDto {
    name: string;
    exerciseIds: number[];
  }