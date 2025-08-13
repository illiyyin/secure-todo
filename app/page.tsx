"use client";

import TodoList from "@/components/TodoList";
import { Shield, Lock, Database } from "lucide-react";

export default function Home() {
  // Configuration is now handled via environment variables
  const dbPath =
    process.env.NEXT_PUBLIC_DATABASE_PATH || "Database path not configured";

  return (
    <div className="min-h-screen gradient-bg">
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Secure Todo</h1>
                  <p className="text-xs text-white/70 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Encrypted database at: {dbPath}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="glass-morphism rounded-2xl p-6 md:p-8">
            <TodoList />
          </div>
        </main>

        <footer className="text-center py-8 text-white/50 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Database className="w-4 h-4" />
            Your data is encrypted and stored locally
          </p>
        </footer>
      </div>
    </div>
  );
}
