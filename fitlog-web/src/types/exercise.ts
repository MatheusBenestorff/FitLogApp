export interface Exercise {
  id: number;
  name: string;
  equipment: string;
  imageUrl: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string;
  heaviestWeight: number;
  bestOneRepMax: number;
  bestSetVolume: number;
  chartData: ChartData[];
  history: ExerciseHistory[];
  }

  export interface CreateExerciseDto {
    name: string;
    muscleGroup: string;
  }

  interface ExerciseSet {
    reps: number;
    weight: number;
  }
  
  interface ExerciseHistory {
    sessionId: number;
    sessionName: string;
    date: string;
    sets: ExerciseSet[];
  }
  
  interface ChartData {
    sessionId: number;
    date: string;
    maxWeight: number;
    oneRepMax: number;
    volume: number;
  }
  
  export interface ExerciseDetails {
    id: number;
    name: string;
    equipment: string;
    imageUrl: string;
    primaryMuscleGroup: string;
    secondaryMuscleGroups: string;
    heaviestWeight: number;
    bestOneRepMax: number;
    bestSetVolume: number;
    chartData: ChartData[];
    history: ExerciseHistory[];
  }