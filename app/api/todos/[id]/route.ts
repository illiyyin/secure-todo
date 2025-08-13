import { NextRequest, NextResponse } from 'next/server';
import { getServerDb } from '@/lib/server-db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getServerDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const { completed, title } = await request.json();
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    let query = 'UPDATE todos SET updated_at = CURRENT_TIMESTAMP';
    const args: any[] = [];

    if (completed !== undefined) {
      query += ', completed = ?';
      args.push(completed ? 1 : 0);
    }

    if (title !== undefined) {
      query += ', title = ?';
      args.push(title.trim());
    }

    query += ' WHERE id = ?';
    args.push(id);

    await db.execute({
      sql: query,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getServerDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM todos WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}