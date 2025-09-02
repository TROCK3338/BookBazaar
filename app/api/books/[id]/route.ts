import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const bookId = parseInt(context.params.id);
    
    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    // Check if book exists and belongs to the seller
    const bookCheck = await pool.query(
      'SELECT id FROM books WHERE id = $1 AND seller_id = $2',
      [bookId, payload.userId]
    );

    if (bookCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Delete the book (sales will be cascade deleted due to foreign key constraint)
    await pool.query('DELETE FROM books WHERE id = $1', [bookId]);

    return NextResponse.json({ message: 'Book deleted successfully' });

  } catch (error) {
    console.error('Delete book error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const bookId = parseInt(context.params.id);
    
    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    const { title, price, stock, image_url } = await request.json();

    if (!title || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Title, price, and stock are required' },
        { status: 400 }
      );
    }

    // Check if book exists and belongs to the seller
    const bookCheck = await pool.query(
      'SELECT id FROM books WHERE id = $1 AND seller_id = $2',
      [bookId, payload.userId]
    );

    if (bookCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Book not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    // Update the book
    const result = await pool.query(
      `UPDATE books 
       SET title = $1, price = $2, stock = $3, image_url = $4 
       WHERE id = $5 
       RETURNING id, title, price, stock, image_url, created_at`,
      [title, parseFloat(price), parseInt(stock), image_url || null, bookId]
    );

    return NextResponse.json({
      message: 'Book updated successfully',
      book: result.rows[0]
    });

  } catch (error) {
    console.error('Update book error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
