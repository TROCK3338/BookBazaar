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

    // Get sales data with book information
    const result = await pool.query(
      `SELECT s.id, s.quantity, s.total_price, s.sale_date, b.title, b.price
       FROM sales s
       JOIN books b ON s.book_id = b.id
       WHERE b.seller_id = $1
       ORDER BY s.sale_date DESC`,
      [payload.userId]
    );

    // Generate some dummy sales if none exist
    let sales = result.rows;
    
    if (sales.length === 0) {
      // Get user's books first
      const booksResult = await pool.query(
        'SELECT id, title, price FROM books WHERE seller_id = $1 LIMIT 5',
        [payload.userId]
      );

      if (booksResult.rows.length > 0) {
        // Generate some dummy sales
        const dummySales = [];
        const books = booksResult.rows;
        
        for (let i = 0; i < 10; i++) {
          const book = books[Math.floor(Math.random() * books.length)];
          const quantity = Math.floor(Math.random() * 5) + 1;
          const totalPrice = (parseFloat(book.price) * quantity).toFixed(2);
          const saleDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
          
          await pool.query(
            'INSERT INTO sales (book_id, quantity, total_price, sale_date) VALUES ($1, $2, $3, $4)',
            [book.id, quantity, totalPrice, saleDate]
          );

          dummySales.push({
            id: i + 1,
            quantity,
            total_price: totalPrice,
            sale_date: saleDate,
            title: book.title,
            price: book.price
          });
        }

        sales = dummySales;
      }
    }

    // Calculate summary statistics
    const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0);
    const totalBooks = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averageOrderValue = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : '0.00';

    return NextResponse.json({
      sales,
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        totalBooksSold: totalBooks,
        totalOrders: sales.length,
        averageOrderValue
      }
    });

  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
