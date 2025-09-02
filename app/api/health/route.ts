import { NextResponse } from 'next/server';
import { checkDbHealth } from '@/lib/db';

export async function GET() {
  try {
    const dbHealth = await checkDbHealth();
    
    // Additional system checks
    const systemChecks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
    };
    
    const healthStatus = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        api: { 
          status: 'healthy',
          responseTime: Date.now() - parseInt(process.hrtime.bigint().toString().slice(0, 13))
        },
        system: systemChecks,
      },
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      deployment: {
        platform: 'Vercel',
        region: process.env.VERCEL_REGION || 'unknown',
        buildId: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      }
    };

    const httpStatus = dbHealth.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('❤️‍🔥 Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        services: {
          database: { status: 'unknown', error: 'Health check failed' },
          api: { status: 'unhealthy' },
        },
        details: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}
