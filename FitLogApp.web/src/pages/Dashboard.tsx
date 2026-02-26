import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sessionService } from "../services/sessionService";
import { userService} from "../services/userService";
import type { UserDetailsDto } from "../types/user";
import type { SessionDetailsDto } from "../types/session";
import { SessionFeed } from "../components/SessionFeed"; 
import { Loader2, Dumbbell } from "lucide-react";
import avatarImg from "../assets/avatar-placeholder.png"; 

export const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionDetailsDto[]>([]);
  const [user, setUser] = useState<UserDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsData, userData] = await Promise.all([
        sessionService.getAllByUser(),
        userService.getCurrentUser()
      ]);
      setSessions(sessionsData);
      setUser(userData);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8 max-w-6xl mx-auto items-start">
      
      {/* COLUNA CENTRAL */}
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
          <SessionFeed sessions={sessions} user={user}/>
        )}
      </div>

      {/* COLUNA DIREITA */}
      <aside className="w-80 hidden lg:block sticky top-8 space-y-6">
        
        {/* Card do Perfil */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div className="relative inline-block mb-3">
             <img src={avatarImg} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
             <span className="absolute bottom-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded border border-white">PRO</span>
          </div>
          
          <h2 className="font-bold text-gray-900 text-lg">
            {user ? user.name : ""}
          </h2>
          <p className="text-sm text-gray-500">
            {user ? user.email : ""}
          </p>

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

          <Link to="/profile" className="block w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg text-sm transition-colors border border-gray-200 text-center">
             See your profile
          </Link>
        </div>

        {/* Card de Sugestões */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           <h3 className="font-bold text-gray-900 text-sm mb-4">Suggested Athletes</h3>
           
           <div className="space-y-4">
             {["grierstrong", "tinyntuffitness", "guillemros"].map((username, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-gray-200 rounded-full overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} alt={username} />
                   </div>
                   <div className="text-xs">
                     <p className="font-bold text-gray-900">{username}</p>
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