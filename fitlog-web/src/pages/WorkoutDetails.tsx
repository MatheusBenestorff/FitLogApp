import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { workoutService } from "../services/workoutService";
import { useAuth } from "../contexts/AuthContext";
import type { WorkoutDetailsDto, WorkoutSetDto } from "../types/workout"; 
import { 
  ArrowLeft, 
  MoreVertical, 
  Play, 
  Link as LinkIcon, 
  Dumbbell
} from "lucide-react";

import avatarImg from "../assets/avatar-placeholder.png"; 

export const WorkoutDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  
  const [workout, setWorkout] = useState<WorkoutDetailsDto | null>(null);
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


  const getRepsDisplay = (sets: WorkoutSetDto[]) => {
    if (!sets || sets.length === 0) return "0 reps";
    
    const reps = sets.map(s => s.targetReps).filter(r => r !== null) as number[];
    if (reps.length === 0) return "- reps";

    const min = Math.min(...reps);
    const max = Math.max(...reps);
    
    if (min === max) return `${min} reps`;
    return `${min}-${max} reps`;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workout) return null;

  const totalExercises = workout.exercises?.length || 0;
  const totalSets = workout.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0) || 0;
  const estimatedDuration = Math.round(totalSets * 3); 

  const muscleSets: Record<string, number> = {};
  workout.exercises?.forEach(ex => {
    const muscle = ex.primaryMuscleGroup || "Other";
    const setsCount = ex.sets?.length || 0;
    muscleSets[muscle] = (muscleSets[muscle] || 0) + setsCount;
  });

  const maxMuscleSets = Math.max(...Object.values(muscleSets), 1);
  const muscleBreakdown = Object.entries(muscleSets).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      
      {/* --- COLUNA ESQUERDA--- */}
      <div className="flex-1">
        
        {/* Header da Página */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/workouts")} className="text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical size={20} />
          </button>
        </header>

        {/* Card Principal com a Lista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => {
                const setsCount = exercise.sets?.length || 0;
                
                return (
                  <div key={`${exercise.id}-${index}`} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    
                    {/* Avatar do Exercício */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100 text-gray-400">
                      {exercise.imageUrl ? (
                        <img 
                          src={exercise.imageUrl} 
                          alt={exercise.name} 
                          className="w-full h-full object-contain bg-white p-1 mix-blend-darken" 
                        />
                      ) : (
                        exercise.name.charAt(0)
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{exercise.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5 font-medium">
                        {setsCount} sets • {getRepsDisplay(exercise.sets)}
                      </p>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                  <Dumbbell size={24} className="text-gray-400" />
                </div>
                <p className="font-medium text-gray-900">No exercises yet</p>
                <p className="text-sm">Click Edit Routine to add exercises.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- COLUNA DIREITA--- */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
            
        {/* Card de "Criado Por" */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={avatarImg} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
            <div className="flex flex-col">
               <span className="text-xs text-gray-500">Created by</span>
               <span className="text-sm font-bold text-gray-900">
                 {user ? user.name.toLowerCase().replace(/\s/g, '') : "Carregando..."}
               </span> 
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-3">
           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
             <Play size={18} fill="currentColor" /> Start Routine
           </button>
           
           {/* Botão Edit */}
           <Link 
             to={`/workouts/edit/${workout.id}`}
             className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center text-sm"
           >
             Edit Routine
           </Link>

           {/* Botão Copy */}
           <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
             <LinkIcon size={16} /> Copy Routine Link
           </button>
        </div>

        {/* Resumo da Rotina */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6 text-lg">Routine Summary</h3>
           
           <div className="flex justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Exercises</span>
                <span className="text-lg font-bold text-gray-900">{totalExercises}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Total Sets</span>
                <span className="text-lg font-bold text-gray-900">{totalSets}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Est. Duration</span>
                <span className="text-lg font-bold text-gray-900">
                   {estimatedDuration > 60 
                     ? `${Math.floor(estimatedDuration / 60)}h ${estimatedDuration % 60}min` 
                     : `${estimatedDuration} min`}
                </span>
              </div>
           </div>

           {/* Placeholder Visual Anatomia */}
           <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300">
                 <Dumbbell size={40} />
              </div>
           </div>

           {/* Gráfico de Músculos */}
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 px-1">
                 <span>Muscle</span>
                 <span>Sets</span>
              </div>

              {muscleBreakdown.map(([muscle, count]) => {
                 const widthPercent = (count / maxMuscleSets) * 100;
                 
                 return (
                    <div key={muscle} className="flex items-center gap-4">
                       <span className="text-sm font-medium text-gray-700 w-20 truncate">{muscle}</span>
                       <div className="flex-1 flex items-center gap-3">
                          {/* Barra Azul */}
                          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                               style={{ width: `${widthPercent}%` }}
                             ></div>
                          </div>
                          {/* Quantidade de Sets */}
                          <span className="text-sm font-semibold text-gray-900 w-6 text-right">{count}</span>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>

      </aside>
    </div>
  );
};