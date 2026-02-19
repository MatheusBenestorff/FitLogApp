import React, { useEffect, useState } from "react";
import { workoutService } from "../services/workoutService";
import type { Workout } from "../types/workout";
import { Plus, FolderPlus, MoreHorizontal, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* LEFT COLUMN: Workout List */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Workouts</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">My Workouts ({workouts.length})</div>

          {workouts.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
              You don't have any workouts yet. Create one to get started!
            </div>
          ) : (
            workouts.map((workout) => (
              <Link
                to={`/workouts/${workout.id}`}
                key={workout.id}
                className="block bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{workout.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {workout.exercises && workout.exercises.length > 0
                        ? workout.exercises.map((e) => e.name).join(", ")
                        : "No exercises added"}
                    </p>
                  </div>
                  
                  {/* Actions Dropdown Trigger */}
                  <button 
                    onClick={(e) => handleDelete(e, workout.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
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
      <div className="w-full md:w-80">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
            
          {/* New Routine Button */}
          <Link 
            to="/workouts/new" 
            className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                    <Plus size={20} className="text-gray-700" />
                </div>
                <span className="font-medium text-gray-700">New Workout</span>
            </div>
            <span className="text-gray-400">›</span>
          </Link>

          {/* New Folder Button (Placeholder) */}
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                    <FolderPlus size={20} className="text-gray-700" />
                </div>
                <span className="font-medium text-gray-700">New Folder</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};