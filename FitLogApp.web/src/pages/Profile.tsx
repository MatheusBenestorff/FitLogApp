import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // <-- Importando o contexto
import { sessionService } from "../services/sessionService";
import type { SessionDetailsDto } from "../types/session";
import { SessionFeed } from "../components/SessionFeed";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import avatarImg from "../assets/avatar-placeholder.png";

export const Profile: React.FC = () => {
  const { user } = useAuth(); 
  
  const [sessions, setSessions] = useState<SessionDetailsDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const sessionsData = await sessionService.getAllByUser();
      setSessions(sessionsData);
    } catch (error) {
      console.error("Erro ao carregar sessões", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER DO PERFIL */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <img 
            src={avatarImg} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
             <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
             <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
               Edit Profile
             </button>
          </div>
          <p className="text-gray-500 text-sm mb-4">@{user.email} • Free User</p>
          
          <div className="flex justify-center md:justify-start gap-8">
             <div>
               <span className="block font-bold text-gray-900 text-lg">{sessions.length}</span>
               <span className="text-xs text-gray-500 uppercase tracking-wide">Workouts</span>
             </div>
             <div>
               <span className="block font-bold text-gray-900 text-lg">0</span>
               <span className="text-xs text-gray-500 uppercase tracking-wide">Followers</span>
             </div>
             <div>
               <span className="block font-bold text-gray-900 text-lg">0</span>
               <span className="text-xs text-gray-500 uppercase tracking-wide">Following</span>
             </div>
          </div>
        </div>
      </div>

      {/* AREA CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna da Esquerda: Gráfico de Estatísticas (Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Statistics</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
               <button className="px-3 py-1 bg-white shadow-sm rounded-md text-xs font-bold text-gray-900">Duration</button>
               <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">Reps</button>
               <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">Volume</button>
            </div>
          </div>

          <div className="mb-4">
             <span className="text-3xl font-bold text-gray-900">53min</span>
             <span className="text-gray-500 text-sm ml-2">This week</span>
          </div>
          
          {/* Mock Visual de Gráfico de Barras */}
          <div className="h-40 flex items-end justify-between gap-2">
             {[40, 60, 30, 80, 50, 90, 20, 45, 70, 60, 30, 10].map((h, i) => (
               <div key={i} className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }}></div>
             ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
             <span>Dec 07</span>
             <span>Jan 04</span>
             <span>Feb 15</span>
          </div>
        </div>

        {/* Coluna da Direita */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900">Calendar</h3>
             <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold">February 2026</span>
                <button className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={16} /></button>
             </div>
           </div>

           {/* Grid do Calendário Simplificado */}
           <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-gray-400 font-medium">{d}</span>)}
           </div>
           <div className="grid grid-cols-7 gap-2">
              {/* Dias Mockados */}
              {Array.from({ length: 28 }).map((_, i) => {
                 const day = i + 1;
                 const isActive = [2, 5, 8, 12, 15, 18, 22].includes(day);
                 return (
                   <div 
                     key={i} 
                     className={`
                       aspect-square flex items-center justify-center rounded-full text-xs cursor-pointer
                       ${isActive ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-50'}
                     `}
                   >
                     {day}
                   </div>
                 )
              })}
           </div>
        </div>

      </div>

      {/* FEED DE ATIVIDADES */}
      <div>
         <h3 className="font-bold text-gray-900 mb-4 text-lg">History</h3>
         <SessionFeed sessions={sessions} user={user}/>
      </div>

    </div>
  );
};