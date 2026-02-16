import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exerciseService } from "../services/exerciseService";
import { workoutService } from "../services/workoutService";
import type { Exercise } from "../types/exercise";
import { 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  Dumbbell, 
  Trash2, 
  Filter 
} from "lucide-react";

export const CreateWorkout: React.FC = () => {
  const navigate = useNavigate();

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getAll();
      setAvailableExercises(data);
    } catch (error) {
      console.error("Erro ao carregar exercícios", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = availableExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) return;
    setSelectedExercises([...selectedExercises, exercise]);
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    setSelectedExercises(selectedExercises.filter((_, index) => index !== indexToRemove));
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Workout"}
          </button>
        </header>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            
            {/* Input Nome */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                placeholder="Ex: Treino de Peito A"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full text-lg p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>

            {/* Lista de Exercícios Selecionados */}
            <div className="space-y-4">
              {selectedExercises.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Dumbbell size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No Exercises</h3>
                  <p className="text-gray-500 mt-1">
                    So far, you haven't added any exercises to this workout.
                  </p>
                </div>
              ) : (
                selectedExercises.map((ex, index) => (
                  <div key={`${ex.id}-${index}`} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {ex.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{ex.name}</h4>
                        <span className="text-xs text-gray-500 uppercase">{ex.muscleGroup}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveExercise(index)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- COLUNA DIREITA --- */}
      <aside className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg z-10">
        
        {/* Library Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">Library</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              + Custom Exercise
            </button>
          </div>

          {/* Filtros Visuais (Dropdowns placeholder) */}
          <div className="flex gap-2 mb-3">
             <button className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100">
               All Equipment <Filter size={14} />
             </button>
             <button className="flex-1 flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-100">
               All Muscles <Filter size={14} />
             </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Exercises" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-sm text-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Lista de Exercícios*/}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="text-center p-4 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-1">
              {filteredExercises.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group transition-colors cursor-pointer"
                  onClick={() => handleAddExercise(exercise)}
                >
                  <div className="flex items-center gap-3">
                    {/* Placeholder Avatar Image */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                       <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <Dumbbell size={18} />
                       </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{exercise.name}</span>
                      <span className="text-xs text-gray-500">{exercise.muscleGroup}</span>
                    </div>
                  </div>
                  
                  <button className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusCircle size={24} fill="currentColor" className="text-white bg-blue-500 rounded-full" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

    </div>
  );
};