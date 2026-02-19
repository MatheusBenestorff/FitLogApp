import React, { useEffect, useState } from "react";
import { sessionService } from "../services/sessionService";
import type { SessionDetailsDto } from "../types/session";
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Loader2, 
  MoreHorizontal,
  Dumbbell
} from "lucide-react";

import avatarImg from "../assets/avatar-placeholder.png"; 

// --- HELPER FUNCTIONS ---

const calculateVolume = (session: SessionDetailsDto) => {
  let volume = 0;
  session.exercises.forEach(ex => {
    ex.sets.forEach(set => {
      volume += set.weight * set.reps;
    });
  });
  return volume.toLocaleString('pt-BR'); 
};

const formatDuration = (durationStr: string | null) => {
  if (!durationStr) return "--";
  const parts = durationStr.split(':'); 
  if (parts.length >= 2) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}min`;
  }
  return durationStr;
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};


export const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionDetailsDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await sessionService.getAllByUser();
      setSessions(data);
    } catch (error) {
      console.error("Erro ao buscar feed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 max-w-6xl mx-auto items-start">
      
      {/* --- COLUNA CENTRAL --- */}
      <div className="flex-1 space-y-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
             <Dumbbell className="mx-auto mb-4 text-gray-300" size={48} />
             <h3 className="text-lg font-semibold text-gray-800">No workouts yet</h3>
             <p>Start a workout session to see your activity here!</p>
          </div>
        ) : (
          sessions.map((session) => (
            // CARD DE SESSÃO
            <div key={session.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Header do Card (Usuário e Data) */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={avatarImg} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">matheusbenestorff</h3>
                    <p className="text-xs text-gray-500">{formatRelativeTime(session.startTime)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Título do Treino e Stats */}
              <div className="px-4 pb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{session.workoutNameSnapshot}</h2>
                
                <div className="flex gap-8 text-sm">
                  <div>
                    <span className="block text-gray-400 text-xs font-bold uppercase">Duration</span>
                    <span className="font-semibold text-gray-800">{formatDuration(session.duration)}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs font-bold uppercase">Volume</span>
                    <span className="font-semibold text-gray-800">{calculateVolume(session)} kg</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-xs font-bold uppercase">Sets</span>
                    <span className="font-semibold text-gray-800">
                       {session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de Exercícios (Resumo) */}
              <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                {session.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center gap-3">
                    {/* Mini Avatar do Exercício */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                       <span className="text-xs font-bold text-gray-500">{ex.exerciseNameSnapshot.charAt(0)}</span>
                    </div>
                    
                    <div className="text-sm">
                       <span className="font-semibold text-gray-800">{ex.sets.length} sets</span>
                       <span className="text-gray-600 mx-1"> {ex.exerciseNameSnapshot}</span>
                    </div>
                  </div>
                ))}
                {session.exercises.length > 5 && (
                  <p className="text-xs text-gray-400 font-medium pl-11">See {session.exercises.length - 5} more exercises</p>
                )}
              </div>

              {/* Rodapé (Ações Sociais) */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex flex-col gap-3">
                {/* Botões */}
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={18} /> <span className="text-xs font-bold">Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <MessageSquare size={18} /> <span className="text-xs font-bold">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Share2 size={18} /> <span className="text-xs font-bold">Share</span>
                  </button>
                </div>

                {/* Input de Comentário */}
                <div className="flex items-center gap-3">
                  <img src={avatarImg} className="w-6 h-6 rounded-full" />
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Write a comment..." 
                      className="w-full bg-white border border-gray-200 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:border-blue-300"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500 hover:text-blue-700">
                      Post
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* --- COLUNA DIREITA (PROFILE & SUGESTÕES) --- */}
      <aside className="w-80 hidden lg:block sticky top-8 space-y-6">
        
        {/* Card do Perfil */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="relative inline-block mb-3">
             <img src={avatarImg} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
             <span className="absolute bottom-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded border border-white">PRO</span>
          </div>
          
          <h2 className="font-bold text-gray-900 text-lg">matheusbenestorff</h2>
          <p className="text-sm text-gray-500">Matheus Benestorff</p>

          <div className="flex justify-center gap-8 mt-6 border-t border-gray-100 pt-4">
             <div className="text-center">
               <span className="block font-bold text-gray-900">
                 {sessions.length}
               </span>
               <span className="text-xs text-gray-400">Workouts</span>
             </div>
             <div className="text-center">
               <span className="block font-bold text-gray-900">0</span>
               <span className="text-xs text-gray-400">Followers</span>
             </div>
             <div className="text-center">
               <span className="block font-bold text-gray-900">0</span>
               <span className="text-xs text-gray-400">Following</span>
             </div>
          </div>

          <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors border border-gray-200">
             See your profile
          </button>
        </div>

        {/* Card de Sugestões (Estático/Mock) */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 text-sm mb-4">Suggested Athletes</h3>
           
           <div className="space-y-4">
             {["grierstrong", "tinyntuffitness", "guillemros"].map((user, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
                      {/* Avatar Mock */}
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`} alt={user} />
                   </div>
                   <div className="text-xs">
                     <p className="font-bold text-gray-900">{user}</p>
                     <p className="text-gray-500">Suggested for you</p>
                   </div>
                 </div>
                 <button className="text-xs font-bold text-blue-500 hover:text-blue-700">Follow</button>
               </div>
             ))}
           </div>
        </div>

      </aside>

    </div>
  );
};