export interface Exercise {
    id: number;
    name: string;
    muscleGroup: string;
  }
  
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