import { NextRequest, NextResponse } from 'next/server';
import { getServerDb } from '@/lib/server-db';

export async function GET() {
  try {
    const db = await getServerDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const result = await db.execute('SELECT * FROM todos ORDER BY created_at DESC');
    return NextResponse.json({ todos: result.rows });
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getServerDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { title } = await request.json();
    
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: 'INSERT INTO todos (title) VALUES (?)',
      args: [title.trim()],
    });

    return NextResponse.json({ 
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}