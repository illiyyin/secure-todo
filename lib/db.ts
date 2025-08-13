import { createClient, type Client } from '@libsql/client';
import { getConfig } from './config';

let dbClient: Client | null = null;

export async function getDb(): Promise<Client | null> {
  if (dbClient) return dbClient;
  
  const config = getConfig();
  if (!config) return null;
  
  try {
    dbClient = createClient({
      url: `file:${config.databasePath}`,
      encryptionKey: config.encryptionKey,
    });
    
    // Initialize the database schema
    await initializeSchema();
    
    return dbClient;
  } catch (error) {
    console.error('Failed to create database client:', error);
    return null;
  }
}

async function initializeSchema() {
  if (!dbClient) return;
  
  try {
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.error('Failed to initialize schema:', error);
  }
}

export async function resetDb() {
  if (dbClient) {
    dbClient = null;
  }
}