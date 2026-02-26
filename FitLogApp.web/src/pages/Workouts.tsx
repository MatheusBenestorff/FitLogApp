import React, { useEffect, useState } from "react";
import { workoutService } from "../services/workoutService";
import { Plus, FolderPlus, MoreHorizontal, Loader2, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import type { WorkoutSummary } from "../types/workout";


export const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const data = await workoutService.getAll();
      setWorkouts(data);
    } catch (err) {
      setError("Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await workoutService.delete(id);
        setWorkouts(workouts.filter((w) => w.id !== id));
      } catch (err) {
        alert("Error deleting workout");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      {/* LEFT COLUMN: Workout List */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Routines</h1>

        {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-4">{error}</div>}

        <div className="space-y-4">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            My Routines ({workouts.length})
          </div>

          {workouts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Dumbbell size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No routines yet</h3>
              <p className="text-gray-500 mt-1 max-w-xs">
                You don't have any workout routines. Create one to get started!
              </p>
            </div>
          ) : (
            workouts.map((workout) => (
              <Link
                to={`/workouts/${workout.id}`}
                key={workout.id}
                className="block bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group relative"
              >
                <div className="flex justify-between items-start">
                  <div className="pr-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{workout.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                      {workout.exercises && workout.exercises.length > 0
                        ? workout.exercises.map((e) => e.name).join(", ")
                        : "No exercises added"}
                    </p>
                  </div>
                  
                  {/* Actions Dropdown Trigger */}
                  <button 
                    onClick={(e) => handleDelete(e, workout.id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors absolute top-4 right-4"
                    title="Delete Workout"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Actions Sidebar */}
      <div className="w-full md:w-80 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
            
          <Link 
            to="/workouts/new" 
            className="flex items-center justify-between p-4 hover:bg-blue-50 border-b border-gray-100 transition-colors group"
          >
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus size={20} />
                </div>
                <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">New Workout</span>
            </div>
            <span className="text-gray-400 group-hover:text-blue-500">›</span>
          </Link>

          {/* New Folder Button (Placeholder) */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left group">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 text-gray-600 p-2 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <FolderPlus size={20} />
                </div>
                <span className="font-semibold text-gray-800">New Folder</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};