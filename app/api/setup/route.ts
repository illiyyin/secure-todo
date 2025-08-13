import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";

// This endpoint initializes the database schema
// Configuration is now handled via environment variables
export async function POST() {
  try {
    // Get configuration from environment variables
    const databasePath = process.env.NEXT_PUBLIC_DATABASE_PATH;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!databasePath) {
      return NextResponse.json(
        { error: "DATABASE_PATH not configured in environment variables" },
        { status: 500 },
      );
    }

    // Test the database connection
    const clientConfig: any = {
      url: `file:${databasePath}`,
    };

    // Only use encryption if enabled via environment variable
    if (process.env.ENABLE_ENCRYPTION !== "false" && encryptionKey) {
      clientConfig.encryptionKey = encryptionKey;
    }

    const client = createClient(clientConfig);

    // Initialize schema
    await client.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 },
    );
  }
}
