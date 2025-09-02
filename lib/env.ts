// Environment configuration validation
export const validateEnv = () => {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  const optionalVars = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  // Check required variables
  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    // In development, show error but don't crash
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  // Log configuration (without sensitive data)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Environment Configuration:');
    console.log('- NODE_ENV:', optionalVars.NODE_ENV);
    console.log('- APP_URL:', optionalVars.NEXT_PUBLIC_APP_URL);
    console.log('- DATABASE_URL:', requiredVars.DATABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('- JWT_SECRET:', requiredVars.JWT_SECRET ? '✅ Set' : '❌ Missing');
  }

  return {
    ...requiredVars,
    ...optionalVars,
  };
};

// Get validated environment variables
export const env = validateEnv();
