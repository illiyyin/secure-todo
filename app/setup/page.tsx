"use client";

import { Shield, Database, Key, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  // Configuration is now managed via environment variables
  const databasePath =
    process.env.NEXT_PUBLIC_DATABASE_PATH || "Not configured";
  const encryptionEnabled =
    process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION !== "false";

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
            <p className="text-gray-600">Configuration Status</p>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">
                    Configuration Complete
                  </p>
                  <p className="text-sm text-green-600">
                    Your app is configured via environment variables
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <Database className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Database Path
                  </p>
                  <p className="text-xs text-gray-600 font-mono">
                    {databasePath}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-lg">
                <Key className="w-5 h-5 text-indigo-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Encryption Status
                  </p>
                  <p className="text-xs text-gray-600">
                    {encryptionEnabled ? (
                      <span className="text-green-600 font-medium">
                        <Shield className="inline-block w-3 h-3 mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Disabled (for development)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/50">
              <p className="text-xs text-gray-500 mb-4">
                To change configuration, update your .env.local file and restart
                the application.
              </p>

              <Link
                href="/"
                className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Go to Todo App
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-center text-gray-500">
              Your data is{" "}
              {encryptionEnabled ? "encrypted locally" : "stored locally"} and
              never leaves your device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
