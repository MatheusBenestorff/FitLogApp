import React, { useState } from "react";
import { exerciseService } from "../services/exerciseService";
import type { Exercise } from "../types/exercise"; 
import { ExerciseLibrary } from "../components/ExerciseLibrary";
import { Dumbbell, BarChart2, Info, Loader2 } from "lucide-react";

export const Exercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSelectExercise = async (exercise: Exercise) => {
    if (selectedExercise?.id === exercise.id) return;

    setLoadingDetails(true);
    setSelectedExercise(null); 

    try {
      const details = await exerciseService.getById(exercise.id);
      setSelectedExercise(details);
    } catch (error) {
      console.error("Erro ao carregar detalhes do exercício", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      
      {/* --- COLUNA ESQUERDA (Detalhes) --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <header className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Exercise Details</h1>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {loadingDetails ? (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
          ) : selectedExercise ? (
            <div className="animate-in fade-in duration-300">
              
              {/* Header do Detalhe */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-md">
                  {selectedExercise.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                    {selectedExercise.muscleGroup}
                  </span>
                </div>
              </div>

              {/* Estatísticas (Placeholder por enquanto) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <BarChart2 size={18} />
                    <span className="text-sm font-medium">Personal Record</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">-- kg</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                   <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Info size={18} />
                    <span className="text-sm font-medium">Total Sets</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-800 text-sm">
                <p>Aqui seriam exibidos gráficos de progresso e histórico deste exercício.</p>
              </div>
            </div>
          ) : (
            // Estado Vazio (Nenhum selecionado)
            <div className="h-full flex flex-col items-center justify-center text-center">
               <div className="bg-gray-50 p-6 rounded-full mb-6">
                 <Dumbbell size={64} className="text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Select Exercise</h3>
               <p className="text-gray-500 max-w-xs">
                 Click on an exercise from the library to see statistics and details about it.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* --- COLUNA DIREITA  --- */}
      <ExerciseLibrary 
        onSelectExercise={handleSelectExercise} 
        selectedExerciseId={selectedExercise?.id}
        className="w-80 md:w-96"
      />

    </div>
  );
};