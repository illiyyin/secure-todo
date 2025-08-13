import { createClient, type Client } from "@libsql/client";

let dbClient: Client | null = null;

export async function getDb(): Promise<Client | null> {
  if (dbClient) return dbClient;

  // Get configuration from environment variables
  const databasePath = process.env.NEXT_PUBLIC_DATABASE_PATH;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!databasePath) {
    console.error(
      "NEXT_PUBLIC_DATABASE_PATH not configured in environment variables",
    );
    return null;
  }

  try {
    const clientConfig: any = {
      url: `file:${databasePath}`,
    };

    // Only use encryption if enabled via environment variable
    // Set ENABLE_ENCRYPTION=false in .env.local to disable encryption
    if (
      process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION !== "false" &&
      encryptionKey
    ) {
      clientConfig.encryptionKey = encryptionKey;
    }

    dbClient = createClient(clientConfig);

    // Initialize the database schema
    await initializeSchema();

    return dbClient;
  } catch (error) {
    console.error("Failed to create database client:", error);
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
    console.error("Failed to initialize schema:", error);
  }
}

export async function resetDb() {
  if (dbClient) {
    dbClient = null;
  }
}
