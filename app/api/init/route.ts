import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function POST() {
  try {
    await initDb();
    return NextResponse.json({ 
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Also allow GET for easier testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Database initialization endpoint - use POST method to initialize',
    status: 'ready'
  });
}
