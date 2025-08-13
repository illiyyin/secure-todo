import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { encryptionKey, databasePath } = await request.json();
    
    if (!encryptionKey || !databasePath) {
      return NextResponse.json(
        { error: 'Encryption key and database path are required' },
        { status: 400 }
      );
    }

    // Test the database connection
    const client = createClient({
      url: `file:${databasePath}`,
      encryptionKey,
    });

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

    // Store config in cookie for server-side access
    const cookieStore = await cookies();
    cookieStore.set('db-config', JSON.stringify({ encryptionKey, databasePath }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}