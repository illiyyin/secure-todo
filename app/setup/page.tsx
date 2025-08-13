'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveConfig } from '@/lib/config';
import { Shield, Database, Key, FolderOpen, Lock, Sparkles } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [encryptionKey, setEncryptionKey] = useState('');
  const [databasePath, setDatabasePath] = useState('./todos.db');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (encryptionKey.length < 8) {
      setError('Encryption key must be at least 8 characters long');
      return;
    }

    if (!databasePath.trim()) {
      setError('Database path is required');
      return;
    }

    setLoading(true);
    try {
      saveConfig({
        encryptionKey,
        databasePath: databasePath.trim(),
      });

      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptionKey, databasePath }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to initialize database');
      }
    } catch (err) {
      setError('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in duration-700">
        <div className="glass-morphism rounded-2xl p-8 transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Secure Todo
            </h1>
            <p className="text-gray-600">Set up your encrypted todo database</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Key className="inline-block w-4 h-4 mr-2 text-indigo-600" />
                Encryption Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter a strong encryption key"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showKey ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <Sparkles className="inline-block w-3 h-3 mr-1" />
                This key encrypts all your data. Don't forget it!
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FolderOpen className="inline-block w-4 h-4 mr-2 text-indigo-600" />
                Database Location
              </label>
              <input
                type="text"
                value={databasePath}
                onChange={(e) => setDatabasePath(e.target.value)}
                className="input-field"
                placeholder="./todos.db"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                <Database className="inline-block w-3 h-3 mr-1" />
                Choose where to store your encrypted database
              </p>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Initializing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Initialize Secure Database
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-center text-gray-500">
              Your data is encrypted locally and never leaves your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}