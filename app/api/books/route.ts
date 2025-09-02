import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT id, title, price, stock, image_url, created_at 
       FROM books 
       WHERE seller_id = $1 
       ORDER BY created_at DESC`,
      [payload.userId]
    );

    return NextResponse.json({ books: result.rows });

  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, price, stock, image_url } = await request.json();

    if (!title || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Title, price, and stock are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO books (seller_id, title, price, stock, image_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, price, stock, image_url, created_at`,
      [payload.userId, title, parseFloat(price), parseInt(stock), image_url || null]
    );

    return NextResponse.json({
      message: 'Book added successfully',
      book: result.rows[0]
    });

  } catch (error) {
    console.error('Add book error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
