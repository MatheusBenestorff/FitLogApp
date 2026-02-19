import React, { useEffect, useState } from "react";
import { exerciseService } from "../services/exerciseService";
import type { Exercise } from "../types/exercise"; 
import { CreateExerciseModal } from "./CreateExerciseModal";
import { Search, Filter, Plus, Loader2 } from "lucide-react";

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: Exercise) => void;
  selectedExerciseId?: number | null;
  className?: string;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ 
  onSelectExercise, 
  selectedExerciseId,
  className = "w-80 md:w-96" 
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
    } catch (error) {
      console.error("Erro ao buscar lista de exercícios", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`${className} bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full`}>
        
      {/* Header da Library */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Library</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
          >
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

        {/* Busca */}
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

      {/* Lista Scrollável */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
          <div className="p-8 flex justify-center text-gray-500">
             <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredExercises.map((exercise) => {
              const isSelected = selectedExerciseId === exercise.id;
              
              return (
                <div 
                  key={exercise.id} 
                  onClick={() =>
                     onSelectExercise(exercise)}                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${isSelected 
                      ? "bg-blue-50 border border-blue-100 ring-1 ring-blue-200" 
                      : "hover:bg-gray-50 border border-transparent"
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${isSelected ? "bg-blue-200 text-blue-700" : "bg-gray-100 text-gray-500"}
                  `}>
                      {exercise.name.charAt(0)}
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${isSelected ? "text-blue-900" : "text-gray-800"}`}>
                      {exercise.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {exercise.muscleGroup}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {filteredExercises.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-400">
                    No exercises found.
                </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      <CreateExerciseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
           fetchList(); 
        }}
      />
    </aside>
  );
};