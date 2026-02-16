import React, { useEffect, useState } from "react";
import { exerciseService } from "../services/exerciseService";
import type { Exercise } from "../types/exercise";
import { 
  Search, 
  Dumbbell, 
  Filter, 
  Plus, 
  BarChart2, 
  Info 
} from "lucide-react";

export const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (error) {
      console.error("Erro ao buscar exercícios", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtragem
  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      
      {/* --- COLUNA ESQUERDA --- */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <header className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Exercise</h1>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {selectedExercise ? (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-start gap-6 mb-8">
                {/* Avatar/Imagem do Exercício */}
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

              {/* Mock de Estatísticas */}
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

      {/* --- COLUNA DIREITA --- */}
      <aside className="w-80 md:w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        
        {/* Library Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Library</h2>
            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              <Plus size={16} /> Custom Exercise
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-3">
             <button className="flex-1 flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
               All Equipment <Filter size={14} />
             </button>
             <button className="flex-1 flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
               All Muscles <Filter size={14} />
             </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Exercises" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-sm text-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
            />
          </div>
        </div>

        {/* Lista de Exercícios */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
               <div className="animate-pulse">Loading library...</div>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercise?.id === exercise.id;
                
                return (
                  <div 
                    key={exercise.id} 
                    onClick={() => setSelectedExercise(exercise)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                      ${isSelected 
                        ? "bg-blue-50 border border-blue-100 ring-1 ring-blue-200" 
                        : "hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    {/* Avatar do item da lista */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                      ${isSelected ? "bg-blue-200 text-blue-700" : "bg-gray-100 text-gray-500"}
                    `}>
                       {exercise.name.charAt(0)}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                        {exercise.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {exercise.muscleGroup}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

    </div>
  );
};