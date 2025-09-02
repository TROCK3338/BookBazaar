# 🚀 BookBazaar Deployment Guide

Complete guide for deploying BookBazaar to production on Vercel + Render.

## 📋 Pre-Deployment Checklist

- [ ] Code reviewed and tested locally
- [ ] Environment variables prepared
- [ ] Database provider chosen (Render/Supabase/Neon)
- [ ] GitHub repository ready

## 🗄️ Database Setup Options

### Option 1: Render PostgreSQL (Recommended)

1. **Create Database**
   ```bash
   # Go to https://render.com
   # Sign up/Login → Create → PostgreSQL
   # Choose a name: bookbazaar-db
   # Region: Choose closest to your users
   # Plan: Free tier is fine for development
   ```

2. **Get Connection String**
   ```bash
   # Copy from Render Dashboard → your-database → Connections
   # Format: postgresql://username:password@hostname:port/database
   ```

3. **Database Configuration**
   ```bash
   # External Database URL (for external connections)
   # Internal Database URL (for Render services)
   # Use External URL for Vercel deployment
   ```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Repository

```bash
# Push your code to GitHub
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Import Project**
   - Sign up/Login
   - Click "Import Git Repository"
   - Select your BookBazaar repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `bookbazaar`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Environment Variables

In Vercel Dashboard → your-project → Settings → Environment Variables:

```bash
# Required Variables
DATABASE_URL=postgresql://username:password@hostname:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional (for better error tracking)
NODE_ENV=production
```

**🔐 Important JWT_SECRET Requirements:**
- Minimum 32 characters
- Use random characters, numbers, symbols
- Never use the default development secret
- Example: `jwt_prod_secret_abc123_xyz789_secure_key_2024`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-app.vercel.app`

## 🔄 Database Initialization

After deployment, initialize your database:

### Method 1: Using cURL
```bash
curl -X POST https://your-app.vercel.app/api/init
```

### Method 2: Using Browser
Navigate to: `https://your-app.vercel.app/api/init`

### Method 3: Using Postman/Insomnia
- Method: POST
- URL: `https://your-app.vercel.app/api/init`
- Send request

**Expected Response:**
```json
{
  "message": "Database initialized successfully",
  "timestamp": "2024-09-02T12:00:00.000Z"
}
```

## ✅ Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### 2. Manual Testing
1. Visit your deployed app
2. Register a new account
3. Add a book
4. Check dashboard analytics
5. Verify all features work

### 3. Database Verification
```bash
# Connect to your database and verify tables exist
# Tables should include: sellers, books, sales
```

## 🔧 Environment-Specific Configurations

### Development
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/bookbazaar
JWT_SECRET=dev-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
```bash
DATABASE_URL=postgresql://render_user:abc123@dpg-xyz.oregon-postgres.render.com/bookbazaar_db
JWT_SECRET=your-super-secure-production-jwt-secret-key
NEXT_PUBLIC_APP_URL=https://bookbazaar-yourname.vercel.app
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if DATABASE_URL is correctly set
# Verify database is accessible
# Check if database exists and tables are created
```

**2. JWT Secret Issues**
```bash
# Make sure JWT_SECRET is set in production
# Ensure it's different from development
# Minimum 32 characters recommended
```

**3. Build Failures**
```bash
# Check Vercel build logs
# Verify all dependencies are in package.json
# Check for TypeScript errors
```

**4. API Routes Not Working**
```bash
# Verify API routes are in correct folder structure
# Check for missing environment variables
# Look at Vercel function logs
```

### Debug Steps

1. **Check Vercel Function Logs**
   - Vercel Dashboard → Functions → View logs

2. **Test API Endpoints**
   ```bash
   curl https://your-app.vercel.app/api/health
   curl https://your-app.vercel.app/api/init
   ```

3. **Database Connection Test**
   ```bash
   # Use database client to connect directly
   psql "your-database-url-here"
   ```

## 🔄 Updating Deployment

### Code Updates
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
# Vercel will automatically redeploy
```

### Environment Variable Updates
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Edit/Add variables
4. Redeploy if needed

## 📊 Performance Optimization

### Database Optimization
- Add indexes for frequently queried columns
- Monitor query performance
- Set up connection pooling

### Frontend Optimization  
- Enable Vercel Edge Functions for global distribution
- Use Next.js Image optimization
- Implement caching strategies

## 🔒 Security Best Practices

### Environment Variables
- Never commit secrets to Git
- Use different secrets for prod/dev
- Rotate secrets regularly

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups

### Application Security
- Keep dependencies updated
- Monitor for vulnerabilities
- Use security headers (already configured)

## 📈 Monitoring & Maintenance

### Set up monitoring for:
- Database connection health
- API response times
- Error rates
- User registration/login success rates

### Regular maintenance:
- Update dependencies monthly
- Monitor database storage usage
- Review and rotate secrets quarterly
- Check Vercel usage limits

## 🎉 Success!

Your BookBazaar application is now live and ready for users!

**Live App:** `https://your-app.vercel.app`
**Admin Dashboard:** `https://your-app.vercel.app/dashboard`
**Health Check:** `https://your-app.vercel.app/api/health`

---

**Need Help?** Check the troubleshooting section or create an issue in your repository.
