
export interface SessionSetDto {
    id: number;
    reps: number;
    weight: number;
    orderIndex: number;
  }
  
  export interface SessionExerciseDto {
    id: number;
    exerciseId: number;
    exerciseNameSnapshot: string;
    muscleGroupSnapshot: string;
    sets: SessionSetDto[];
  }
  
  export interface SessionDetailsDto {
    id: number;
    userId: number;
    workoutNameSnapshot: string;
    startTime: string;
    endTime: string | null;
    duration: string | null; 
    exercises: SessionExerciseDto[];
  }