# BookBazaar - Multi-Seller Book Portal

A comprehensive Next.js application for book sellers to manage their inventory, track sales, and grow their business.

## 🚀 Features

- **Authentication System**: Secure login/register with JWT tokens
- **Dashboard**: Comprehensive seller panel with analytics
- **Book Management**: Add, edit, delete, and manage book inventory
- **Sales Analytics**: Track sales performance with detailed reports
- **Profile Management**: Update seller information and view statistics
- **Responsive Design**: Clean UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel (frontend) + Render (database)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)

### Local Development

1. **Clone and install dependencies**
   ```bash
   cd bookbazaar
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file with:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@host:port/database_name
   
   # JWT Secret (change in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Initialize Database**
   ```bash
   npm run dev
   ```
   Then visit: `http://localhost:3000/api/init` (POST request) to create tables

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)


## 📊 Database Schema

```sql
-- Sellers table
CREATE TABLE sellers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table  
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES sellers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table (for analytics)
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Usage

1. **Register/Login**: Create seller account or login
2. **Dashboard**: View analytics and quick actions
3. **Add Books**: Use the form to add books with images
4. **Manage Inventory**: Edit/delete books, update stock
5. **View Sales**: Track performance and revenue
6. **Profile**: Update account information

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies for security
- Input validation and sanitization
- SQL injection protection with parameterized queries

## 🎨 UI/UX Features

- Responsive design for all devices
- Clean, modern interface
- Loading states and error handling
- Image upload and preview
- Interactive dashboard with statistics
- Smooth transitions and animations

## 📈 Features Included

✅ User Authentication (Login/Register/Logout)
✅ Protected Dashboard Routes  
✅ Book CRUD Operations
✅ Sales Analytics with Dummy Data
✅ Profile Management
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Form Validation

## 🚀 Production Checklist

- [ ] Update JWT_SECRET to a secure random string
- [ ] Set up proper database with backups
- [ ] Configure CORS if needed
- [ ] Set up monitoring and logging
- [ ] Test all features in production
- [ ] Set up database migrations for updates

## 📞 Support

For any issues or questions:
- Check the browser console for errors
- Ensure database connection is working
- Verify all environment variables are set correctly
- Check network requests in browser dev tools

---

**Built with ❤️ by Aman Singhal**