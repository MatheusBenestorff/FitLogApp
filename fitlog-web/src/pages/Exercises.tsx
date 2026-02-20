import React, { useState } from "react";
import { Link } from "react-router-dom";
import { exerciseService } from "../services/exerciseService";
import { ExerciseLibrary } from "../components/ExerciseLibrary";
import type { ExerciseDetails } from "../types/exercise"; 

import { Dumbbell, Loader2, Image as ImageIcon } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1 bg-gray-50 px-2 py-0.5 rounded">{formattedDate}</span>
        <span className="font-bold text-gray-900 text-sm mb-3">{payload[0].value} kg</span>
        <Link 
          to={`/workouts/${data.sessionId}`} 
          className="text-blue-600 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          See Workout
        </Link>
      </div>
    );
  }
  return null;
};


export const Exercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'statistics' | 'history'>('statistics');

  const handleSelectExercise = async (exercise: any) => {
    if (selectedExercise?.id === exercise.id) return;

    setLoadingDetails(true);
    setSelectedExercise(null); 
    setActiveTab('statistics');

    try {
      const details = await exerciseService.getById(exercise.id);
      setSelectedExercise(details);
    } catch (error) {
      console.error("Erro ao carregar detalhes do exercício", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDateAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6">
      
      {/* --- COLUNA ESQUERDA (Detalhes) --- */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        {loadingDetails ? (
          <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm">
              <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : selectedExercise ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* HEADER DO EXERCÍCIO*/}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-8 justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">{selectedExercise.name}</h1>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-2">
                       <span className="text-gray-500 w-36">Equipment:</span>
                       <span className="font-medium text-gray-900">{selectedExercise.equipment}</span>
                    </div>
                    <div className="flex gap-2">
                       <span className="text-gray-500 w-36">Primary Muscle Group:</span>
                       <span className="font-medium text-gray-900">{selectedExercise.primaryMuscleGroup}</span>
                    </div>
                    {selectedExercise.secondaryMuscleGroups && (
                      <div className="flex gap-2">
                         <span className="text-gray-500 w-36">Secondary Muscles:</span>
                         <span className="font-medium text-gray-900">{selectedExercise.secondaryMuscleGroups}</span>
                      </div>
                    )}
                  </div>
               </div>
               
               {/* Imagem do Exercício (Placeholder) */}
               <div className="w-full md:w-64 h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 flex-shrink-0">
                  <ImageIcon size={48} />
               </div>
            </div>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               
               {/* Tabs Navegação */}
               <div className="flex border-b border-gray-100 px-6">
                  <button 
                    onClick={() => setActiveTab('statistics')}
                    className={`py-4 font-semibold text-sm border-b-2 transition-colors mr-6 ${activeTab === 'statistics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                    Statistics
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className={`py-4 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                  >
                    History
                  </button>
               </div>

               {/* TAB: STATISTICS */}
               {activeTab === 'statistics' && (
                 <div className="p-6">
                    <div className="mb-8">
                       <select className="border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 bg-white">
                          <option>Last 12 weeks</option>
                          <option>All time</option>
                       </select>
                    </div>

                    {/* Gráfico 1: Heaviest Weight */}
                    <div className="mb-12">
                       <h3 className="font-bold text-gray-900">Weight</h3>
                       <p className="text-xs text-gray-500 mb-1">Heaviest Weight</p>
                       <p className="text-3xl font-bold text-gray-900 mb-6">{selectedExercise.heaviestWeight} kg</p>
                       
                       <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={selectedExercise.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" tickFormatter={formatDateAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dx={-10} />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                                <Line type="monotone" dataKey="maxWeight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Gráfico 2: One Rep Max */}
                    <div className="mb-12 border-t border-gray-100 pt-8">
                       <h3 className="font-bold text-gray-900">One Rep Max</h3>
                       <p className="text-xs text-gray-500 mb-1">Best One Rep Max</p>
                       <p className="text-3xl font-bold text-gray-900 mb-6">{selectedExercise.bestOneRepMax} kg</p>
                       
                       <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={selectedExercise.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" tickFormatter={formatDateAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dx={-10} />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                                <Line type="monotone" dataKey="oneRepMax" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Gráfico 3: Set Volume*/}
                    <div className="mb-12 border-t border-gray-100 pt-8">
                       <h3 className="font-bold text-gray-900">Set Volume</h3>
                       <p className="text-xs text-gray-500 mb-1">Best Set Volume</p>
                       <p className="text-3xl font-bold text-gray-900 mb-6">{selectedExercise.bestSetVolume} kg</p>
                       
                       <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={selectedExercise.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" tickFormatter={formatDateAxis} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dx={-10} />
                                <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                             </LineChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
               )}

               {/* TAB: HISTORY */}
               {activeTab === 'history' && (
                 <div className="p-6">
                    {selectedExercise.history.length === 0 ? (
                       <p className="text-gray-500 text-center py-8">No history for this exercise yet.</p>
                    ) : (
                       <div className="space-y-8">
                          {selectedExercise.history.map((session, i) => (
                             <div key={`${session.sessionId}-${i}`}>
                                {/* Cabeçalho da Sessão no Histórico */}
                                <div className="mb-4">
                                   <Link to={`/workouts/${session.sessionId}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                      {session.sessionName}
                                   </Link>
                                   <p className="text-xs text-gray-500">{new Date(session.date).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                                </div>

                                {/* Tabela de Sets */}
                                <div className="w-full">
                                   <div className="flex text-xs font-semibold text-gray-400 mb-2 px-2">
                                      <div className="w-16">SET</div>
                                      <div>KG x REPS</div>
                                   </div>
                                   <div className="space-y-1">
                                      {session.sets.map((set, setIndex) => (
                                         <div key={setIndex} className={`flex text-sm py-2 px-2 rounded ${setIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                            <div className="w-16 font-medium text-gray-900">{setIndex + 1}</div>
                                            <div className="text-gray-700">{set.weight} kg x {set.reps}</div>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
               )}

            </div>
          </div>
        ) : (
          // Estado Vazio (Nenhum selecionado)
          <div className="h-full flex flex-col items-center justify-center text-center bg-white rounded-xl border border-gray-200 shadow-sm">
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

      {/* --- COLUNA DIREITA (Library) --- */}
      <ExerciseLibrary 
        onSelectExercise={handleSelectExercise} 
        selectedExerciseId={selectedExercise?.id}
        className="w-80 md:w-96 flex-shrink-0"
      />

    </div>
  );
};