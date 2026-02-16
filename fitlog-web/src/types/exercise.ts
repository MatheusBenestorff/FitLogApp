export interface Exercise {
    id: number;
    name: string;
    muscleGroup: string;
  }

  export interface CreateExerciseDto {
    name: string;
    muscleGroup: string;
  }