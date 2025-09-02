import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
      'SELECT id, name, email, created_at FROM sellers WHERE id = $1',
      [payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Get additional statistics
    const booksResult = await pool.query(
      'SELECT COUNT(*) as book_count FROM books WHERE seller_id = $1',
      [payload.userId]
    );

    const salesResult = await pool.query(
      `SELECT COUNT(*) as sale_count, COALESCE(SUM(total_price), 0) as total_revenue
       FROM sales s
       JOIN books b ON s.book_id = b.id
       WHERE b.seller_id = $1`,
      [payload.userId]
    );

    return NextResponse.json({
      user: {
        ...user,
        bookCount: parseInt(booksResult.rows[0].book_count),
        saleCount: parseInt(salesResult.rows[0].sale_count),
        totalRevenue: parseFloat(salesResult.rows[0].total_revenue)
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken by another user
    const existingUser = await pool.query(
      'SELECT id FROM sellers WHERE email = $1 AND id != $2',
      [email, payload.userId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email is already taken by another user' },
        { status: 409 }
      );
    }

    // Update user profile
    await pool.query(
      'UPDATE sellers SET name = $1, email = $2 WHERE id = $3',
      [name, email, payload.userId]
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: { name, email }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
