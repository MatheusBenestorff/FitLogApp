import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import type { Workout } from "../types/workout";
import { 
  ArrowLeft, 
  MoreVertical, 
  Play, 
  Edit2, 
  Link as LinkIcon, 
  Dumbbell,
  Clock,
  LayoutList,
  ImageIcon
} from "lucide-react";

import avatarImg from "../assets/avatar-placeholder.png"; 

export const WorkoutDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadWorkout(parseInt(id));
    }
  }, [id]);

  const loadWorkout = async (workoutId: number) => {
    try {
      const data = await workoutService.getById(workoutId);
      setWorkout(data);
    } catch (error) {
      console.error("Erro ao carregar workout", error);
      navigate("/workouts"); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading workout details...</div>;
  }

  if (!workout) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      
      {/* ---  Lista de Exercícios --- */}
      <div className="flex-1">
        
        {/* Header da Página */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/workouts")} className="text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={24} />
          </button>
        </header>

        {/* Card Principal com a Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Lista de Exercícios */}
          <div className="divide-y divide-gray-100">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => (
                <div key={`${exercise.id}-${index}`} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  
                      {/* Avatar do Exercício */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden bg-gray-100 text-gray-500">
                        {exercise.imageUrl ? (
                          <img 
                            src={exercise.imageUrl} 
                            alt={exercise.name} 
                            className="w-full h-full object-contain bg-white p-0.5 mix-blend-darken" 
                          />
                        ) : (
                          exercise.name.charAt(0)
                        )}
                      </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {/* placeholder por enquanto*/}
                      3 sets • 10 reps
                    </p>
                  </div>

                  {/* Grupo Muscular */}
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {exercise.primaryMuscleGroup}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No exercises in this routine yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- Sidebar de Ações --- */}
      <aside className="w-full lg:w-80 flex flex-col gap-6">
        
        {/* Card de "Criado Por" */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <img src={avatarImg} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
             <span className="text-xs text-gray-500">Created by</span>
             {/* Nome fixo por enquanto*/}
             <span className="text-sm font-bold text-gray-900">You</span> 
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-3">
           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
             <Play size={18} fill="currentColor" /> Start Routine
           </button>
           
           <Link 
             to={`/workouts/edit/${workout.id}`}
             className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
           >
             <Edit2 size={18} /> Edit Routine
           </Link>

           <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
             <LinkIcon size={18} /> Copy Routine Link
           </button>
        </div>

        {/* Resumo da Rotina (Placeholder Visual) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-4">Routine Summary</h3>
           
           <div className="flex justify-between mb-6 text-center">
              <div>
                <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Exercises</span>
                <span className="text-xl font-bold text-gray-900">{workout.exercises?.length || 0}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Total Sets</span>
                <span className="text-xl font-bold text-gray-900">--</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Est. Duration</span>
                <span className="text-xl font-bold text-gray-900">-- min</span>
              </div>
           </div>

           {/* Gráfico de Músculos (Placeholder Visual) */}
           <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Muscles Targeted</h4>
              
              {/* Lista simples de músculos baseada nos exercícios */}
              <div className="space-y-2">

                 {Array.from(new Set(workout.exercises?.map(e => e.primaryMuscleGroup))).map(muscle => (
                    <div key={muscle} className="flex items-center justify-between text-sm">
                       <span className="text-gray-600">{muscle}</span>
                       <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-1/2 rounded-full"></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </aside>
    </div>
  );
};