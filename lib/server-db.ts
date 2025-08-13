import { createClient, type Client } from "@libsql/client";

let serverDbClient: Client | null = null;

export async function getServerDb(): Promise<Client | null> {
  // Get configuration from environment variables
  const databasePath = process.env.NEXT_PUBLIC_DATABASE_PATH;
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!databasePath) {
    console.error("DATABASE_PATH not configured in environment variables");
    return null;
  }

  try {
    if (!serverDbClient) {
      const clientConfig: any = {
        url: `file:${databasePath}`,
      };

      // Only use encryption if enabled via environment variable
      if (encryptionKey) {
        clientConfig.encryptionKey = encryptionKey;
      }

      serverDbClient = createClient(clientConfig);

      // Initialize the database schema
      await serverDbClient.execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    return serverDbClient;
  } catch (error) {
    console.error("Failed to create server database client:", error);
    return null;
  }
}
