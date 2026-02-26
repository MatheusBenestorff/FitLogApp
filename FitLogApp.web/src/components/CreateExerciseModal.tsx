import React, { useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { exerciseService } from "../services/exerciseService";

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MUSCLE_GROUPS = [
  "Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs", "Cardio", "Full Body"
];

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !muscleGroup) return;

    setLoading(true);
    try {
      await exerciseService.create({ name, muscleGroup });
      onSuccess(); 
      handleClose();
    } catch (error) {
      alert("Error creating exercise. Name might be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setMuscleGroup("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Create Custom Exercise</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Image Placeholder */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200 mb-2">
                <ImagePlus className="text-gray-300" size={24} />
            </div>
            <span className="text-xs text-gray-400">Image upload coming soon</span>
          </div>

          <div className="space-y-5">
            {/* Exercise Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                Exercise Name
              </label>
              <input 
                type="text" 
                placeholder="Ex: Bench Press" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                required
              />
            </div>

            {/* Muscle Group */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">
                Primary Muscle Group
              </label>
              <div className="relative">
                <select 
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select muscle group...</option>
                  {MUSCLE_GROUPS.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {/* Custom Chevron Icon */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end gap-3">
             <button 
               type="button"
               onClick={handleClose}
               className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
             >
               Cancel
             </button>
             <button 
               type="submit" 
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
             >
               {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Exercise"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};