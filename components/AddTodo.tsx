"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";

interface AddTodoProps {
  onAdd: () => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isAdding) return;

    setIsAdding(true);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (response.ok) {
        setTitle("");
        onAdd();
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div
        className={`relative transition-all duration-300 ${isFocused ? "transform scale-[1.02]" : ""}`}
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What needs to be done?"
              className="w-full input-field pr-10"
              disabled={isAdding}
            />
            {title && (
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 animate-pulse" />
            )}
          </div>
          <button
            type="submit"
            disabled={!title.trim() || isAdding}
            className="btn-primary px-6 py-3 flex items-center gap-2 min-w-[100px] justify-center"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add
              </>
            )}
          </button>
        </div>
        {isFocused && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl rounded-xl"></div>
        )}
      </div>
    </form>
  );
}
