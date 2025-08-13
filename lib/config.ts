export interface AppConfig {
  encryptionKey: string;
  databasePath: string;
}

const CONFIG_KEY = 'todo-app-config';

export function getConfig(): AppConfig | null {
  if (typeof window === 'undefined') return null;
  
  const configStr = localStorage.getItem(CONFIG_KEY);
  if (!configStr) return null;
  
  try {
    return JSON.parse(configStr);
  } catch {
    return null;
  }
}

export function saveConfig(config: AppConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONFIG_KEY);
}

export function isConfigured(): boolean {
  return getConfig() !== null;
}