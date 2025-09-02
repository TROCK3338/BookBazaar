import { Pool } from 'pg';
import { env } from './env';

// Enhanced connection configuration for different environments
const poolConfig = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection could not be established
  acquireTimeoutMillis: 60000, // Return error after 60 seconds if all clients are busy
  // Add retry logic for connection failures
  retryDelayMs: 1000,
};

// Create connection pool with error handling
const pool = new Pool(poolConfig);

// Enhanced connection event handling
pool.on('connect', (client) => {
  console.log('📊 Connected to PostgreSQL database');
  // Set timezone for consistent date handling
  client.query('SET timezone = "UTC"');
});

pool.on('error', (err, client) => {
  console.error('💥 Unexpected error on idle client', err);
  // Don't exit the process, let the pool handle reconnection
});

pool.on('acquire', () => {
  // Optional: log when a client is acquired from the pool
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 Client acquired from pool');
  }
});

pool.on('release', () => {
  // Optional: log when a client is released back to the pool
  if (process.env.NODE_ENV === 'development') {
    console.log('🔓 Client released back to pool');
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Gracefully shutting down database pool...');
  await pool.end();
  process.exit(0);
});

export default pool;

// Database initialization script
export const initDb = async () => {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');

    // Create sellers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create books table
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sales table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_books_seller_id ON books(seller_id);
      CREATE INDEX IF NOT EXISTS idx_sales_book_id ON sales(book_id);
      CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);
    `);

    // Commit transaction
    await client.query('COMMIT');
    
    console.log('✅ Database tables and indexes initialized successfully');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Health check function
export const checkDbHealth = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
};
