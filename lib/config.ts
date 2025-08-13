export interface AppConfig {
  encryptionKey: string;
  databasePath: string;
}

// Read configuration from environment variables
export function getConfig(): AppConfig | null {
  // For client-side, use NEXT_PUBLIC_ prefixed variables
  if (typeof window !== "undefined") {
    const databasePath = process.env.NEXT_PUBLIC_DATABASE_PATH;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!databasePath) {
      console.error("NEXT_PUBLIC_DATABASE_PATH not configured");
      return null;
    }

    return {
      databasePath,
      encryptionKey: encryptionKey || "",
    };
  }

  // For server-side, use regular env variables
  const databasePath = process.env.DATABASE_PATH;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!databasePath) {
    console.error("DATABASE_PATH not configured");
    return null;
  }

  return {
    databasePath,
    encryptionKey: encryptionKey || "",
  };
}

export function isConfigured(): boolean {
  const config = getConfig();
  return config !== null && !!config.databasePath;
}

// These functions are no longer needed but kept for compatibility
export function saveConfig(config: AppConfig): void {
  console.warn(
    "saveConfig is deprecated - configuration is now managed via environment variables",
  );
}

export function clearConfig(): void {
  console.warn(
    "clearConfig is deprecated - configuration is now managed via environment variables",
  );
}
