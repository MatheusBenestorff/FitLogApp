import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import type { Exercise } from "../types/exercise"; 
import type { UpdateWorkoutDto } from "../types/workout"; 
import { ExerciseLibrary } from "../components/ExerciseLibrary";
import { 
  ArrowLeft, 
  Dumbbell, 
  Trash2,
  GripVertical,
  Loader2
} from "lucide-react";

interface WorkoutSet {
    weight: string;
    reps: string;
  }
  
  interface WorkoutExercise {
    id: number;
    name: string;
    primaryMuscleGroup: string;
    imageUrl?: string | null;
    sets: WorkoutSet[];
  }

export const EditWorkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadWorkout(parseInt(id));
    }
  }, [id]);

  const loadWorkout = async (workoutId: number) => {
    try {
      const data = await workoutService.getById(workoutId);
      setWorkoutName(data.name);

      const mappedExercises: WorkoutExercise[] = data.exercises.map((ex) => ({
        id: ex.exerciseId,
        name: ex.name,
        primaryMuscleGroup: ex.primaryMuscleGroup,
        imageUrl: ex.imageUrl,
        sets: ex.sets.map((set) => ({
          weight: set.targetWeight !== null ? set.targetWeight.toString() : "",
          reps: set.targetReps !== null ? set.targetReps.toString() : ""
        }))
      }));

      setSelectedExercises(mappedExercises);
    } catch (error) {
      console.error("Erro ao carregar rotina", error);
      alert("Error loading routine.");
      navigate("/workouts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExerciseFromLibrary = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) return;
    
    setSelectedExercises(prev => [
      ...prev, 
      { 
        id: exercise.id,
        name: exercise.name,
        primaryMuscleGroup: exercise.primaryMuscleGroup,
        imageUrl: exercise.imageUrl,
        sets: [{ weight: "", reps: "" }] 
      }
    ]);
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setSelectedExercises(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...selectedExercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    
    updatedExercises[exerciseIndex].sets.push({ 
      weight: lastSet ? lastSet.weight : "", 
      reps: lastSet ? lastSet.reps : "" 
    });
    
    setSelectedExercises(updatedExercises);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndexToRemove: number) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter((_, index) => index !== setIndexToRemove);
    setSelectedExercises(updatedExercises);
  };

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setSelectedExercises(updatedExercises);
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      alert("Please give your routine a title.");
      return;
    }
    if (selectedExercises.length === 0) {
      alert("Add at least one exercise.");
      return;
    }
    if (!id) return;

    setIsSaving(true);
    try {
      const payload: UpdateWorkoutDto = {
        name: workoutName,
        exercises: selectedExercises.map((ex, i) => ({
          exerciseId: ex.id,
          orderIndex: i,
          sets: ex.sets.map((set, setIndex) => ({
            orderIndex: setIndex,
            targetWeight: set.weight ? parseFloat(set.weight) : null,
            targetReps: set.reps ? parseInt(set.reps) : null
          }))
        }))
      };

      await workoutService.update(parseInt(id), payload);
      navigate(`/workouts/${id}`); 
    } catch (error) {
      alert("Error updating routine.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalSets = selectedExercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">

      {/* --- COLUNA ESQUERDA --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Edit Routine</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 text-sm"
          >
            {isSaving ? "Updating..." : "Update Routine"}
          </button>
        </header>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Input Nome */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <input
                type="text"
                placeholder="Workout Routine Title"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full text-xl font-bold text-gray-900 placeholder-gray-400 outline-none"
                autoFocus
              />
            </div>

            {/* Lista de Exercícios */}
            <div className="space-y-4">
              {selectedExercises.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                    <Dumbbell size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">No exercises added</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">
                    Select exercises from the library on the right to build your routine.
                  </p>
                </div>
              ) : (
                selectedExercises.map((ex, exerciseIndex) => (
                  <div key={`${ex.id}-${exerciseIndex}`} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    
                    {/* Cabeçalho do Exercício */}
                    <div className="p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        {/* Drag Handle */}
                        <div className="text-gray-300 cursor-grab hover:text-gray-500">
                           <GripVertical size={20} />
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden bg-gray-100 text-gray-500">
                          {ex.imageUrl ? (
                            <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-contain bg-white p-0.5 mix-blend-darken" />
                          ) : (
                            ex.name.charAt(0)
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900">{ex.name}</h4>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleRemoveExercise(exerciseIndex)} className="text-red-400 hover:text-red-600 p-2">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>

                    {/* Tabela de Séries */}
                    <div className="px-4 pb-4">
                      {/* Headers da Tabela */}
                      <div className="flex text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
                        <div className="w-12 text-center">Set</div>
                        <div className="flex-1 text-center">KG</div>
                        <div className="flex-1 text-center">Reps</div>
                        <div className="w-8"></div> 
                      </div>

                      {/* Linhas das Séries */}
                      <div className="space-y-2">
                        {ex.sets.map((set, setIndex) => (
                          <div key={setIndex} className="flex items-center gap-2 group/set">
                            <div className="w-12 text-center text-sm font-bold text-gray-500 bg-gray-100 py-1.5 rounded-md">
                              {setIndex + 1}
                            </div>
                            
                            <div className="flex-1">
                              <input 
                                type="number" 
                                placeholder="-"
                                value={set.weight}
                                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                className="w-full bg-gray-100 text-center py-1.5 rounded-md text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <input 
                                type="number" 
                                placeholder="-"
                                value={set.reps}
                                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                className="w-full bg-gray-100 text-center py-1.5 rounded-md text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>

                            <div className="w-8 flex justify-center">
                              {ex.sets.length > 1 && (
                                <button 
                                  onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover/set:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Botão Adicionar Série */}
                      <button 
                        onClick={() => handleAddSet(exerciseIndex)}
                        className="w-full mt-4 py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-bold rounded-lg transition-colors"
                      >
                        + Add Set
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- COLUNA DIREITA --- */}
      <div className="w-96 hidden lg:flex flex-col gap-6 flex-shrink-0 h-full">
         
         {/* Summary Card */}
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
            <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
            <div className="flex justify-between items-center">
               <div className="flex gap-8">
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Exercises</span>
                     <span className="font-bold text-gray-900 text-lg">{selectedExercises.length}</span>
                  </div>
                  <div>
                     <span className="block text-xs text-gray-500 mb-1">Total Sets</span>
                     <span className="font-bold text-gray-900 text-lg">{totalSets}</span>
                  </div>
               </div>
               
               {/* Placeholder do Mapa Muscular */}
               <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 border border-gray-100">
                  <Dumbbell size={24} />
               </div>
            </div>
         </div>

         {/* Library  */}
         <ExerciseLibrary 
           onSelectExercise={handleAddExerciseFromLibrary} 
           className="flex-1" 
         />
      </div>

    </div>
  );
};