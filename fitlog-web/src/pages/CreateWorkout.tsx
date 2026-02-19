import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import type { Exercise } from "../types/exercise"; // Ajuste o caminho se necessário
import { ExerciseLibrary } from "../components/ExerciseLibrary";
import { 
  ArrowLeft, 
  Dumbbell, 
  Trash2
} from "lucide-react";

export const CreateWorkout: React.FC = () => {
  const navigate = useNavigate();

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [isSaving, setIsSaving] = useState(false);


  const handleAddExerciseFromLibrary = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) return;
    setSelectedExercises(prev => [...prev, exercise]);
};

  const handleRemoveExercise = (indexToRemove: number) => {
    setSelectedExercises(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      alert("Por favor, dê um nome para a rotina.");
      return;
    }
    if (selectedExercises.length === 0) {
      alert("Adicione pelo menos um exercício.");
      return;
    }

    setIsSaving(true);
    try {
      await workoutService.create({
        name: workoutName,
        exerciseIds: selectedExercises.map(e => e.id)
      });
      navigate("/workouts"); 
    } catch (error) {
      alert("Erro ao criar rotina.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Container Principal 
    <div className="flex h-[calc(100vh-6rem)] gap-6">

      {/* --- COLUNA ESQUERDA (Editor do Treino) --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header do Editor */}
        <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Create Workout</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 text-sm"
          >
            {isSaving ? "Saving..." : "Save Workout"}
          </button>
        </header>

        {/* Conteúdo Scrollável */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            
            {/* Input Nome */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Workout Name
              </label>
              <input
                type="text"
                placeholder="Ex: Chest Day - Hypertrophy"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full text-lg p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Lista de Exercícios Selecionados */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2 px-1">
                 <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Exercises ({selectedExercises.length})
                 </h3>
              </div>

              {selectedExercises.length === 0 ? (
                // Empty State
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="bg-white p-4 rounded-full mb-4 shadow-sm border border-gray-100">
                    <Dumbbell size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">No exercises added</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs">
                    Select exercises from the library on the right to build your routine.
                  </p>
                </div>
              ) : (
                // Lista de Itens
                selectedExercises.map((ex, index) => (
                  <div key={`${ex.id}-${index}`} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                        {ex.name.charAt(0)}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h4 className="font-semibold text-gray-800">{ex.name}</h4>
                        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full font-medium">
                            {ex.muscleGroup}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <button 
                      onClick={() => handleRemoveExercise(index)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      <ExerciseLibrary 
        onSelectExercise={handleAddExerciseFromLibrary} 
        className="w-96 hidden lg:flex" 
      />

    </div>
  );
};