'use client';

import { useState } from 'react';
import { Trash2, Edit2, Check, X, Circle, CheckCircle2, Clock } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: number;
  created_at: string;
  updated_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void;
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-gray-300/50 transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className="relative flex-shrink-0"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 transition-all duration-200" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-indigo-600 transition-all duration-200" />
          )}
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          )}
        </button>
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <span className={`block text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </span>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(todo.created_at)}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
      
      {todo.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
}