'use client';

import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import { Loader2, CheckCircle2, Circle, Sparkles } from 'lucide-react';

interface Todo {
  id: number;
  title: string;
  completed: number;
  created_at: string;
  updated_at: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTodos = async () => {
    try {
      setError('');
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      } else {
        setError('Failed to fetch todos');
      }
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your secure todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          My Tasks
        </h2>
        <p className="text-gray-600">Manage your encrypted todos securely</p>
      </div>

      <AddTodo onAdd={fetchTodos} />
      
      {todos.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'active' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === 'completed' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            {completedCount} of {todos.length} completed
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <Circle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {filter === 'all' 
                ? "No todos yet. Add one above!" 
                : `No ${filter} todos`}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))
        )}
      </div>
    </div>
  );
}