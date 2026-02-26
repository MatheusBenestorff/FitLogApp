
export interface WorkoutSummary {
  id: number;
  name: string;
  exercises: {
    exerciseId: number;
    name: string;
    primaryMuscleGroup: string;
  }[];
}

export interface WorkoutSetDto {
  id: number;
  orderIndex: number;
  targetWeight: number | null;
  targetReps: number | null;
}

export interface WorkoutExerciseDto {
  id: number;
  exerciseId: number;
  name: string;
  primaryMuscleGroup: string;
  imageUrl: string | null;
  orderIndex: number;
  sets: WorkoutSetDto[];
}

export interface WorkoutDetailsDto {
  id: number;
  name: string;
  userId: number;
  exercises: WorkoutExerciseDto[]; 
}


export interface CreateWorkoutSetDto {
  orderIndex: number;
  targetWeight: number | null;
  targetReps: number | null;
}

export interface CreateWorkoutExerciseDto {
  exerciseId: number;
  orderIndex: number;
  sets: CreateWorkoutSetDto[];
}

export interface CreateWorkoutDto {
  name: string;
  exercises: CreateWorkoutExerciseDto[];
}

export interface FormWorkoutSet {
  weight: string;
  reps: string;
}

export interface FormWorkoutExercise {
  id: number;
  name: string;
  primaryMuscleGroup: string;
  imageUrl?: string | null;
  sets: FormWorkoutSet[];
}

export interface UpdateWorkoutDto extends CreateWorkoutDto {}