import { NextResponse } from 'next/server';
import { getServerGrailClient } from '@/lib/grail/server-client';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    grailApi: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: string;
    };
    app: {
      status: 'up';
      environment: string;
      network: string;
    };
  };
}

export async function GET() {
  const startTime = Date.now();
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    services: {
      grailApi: {
        status: 'down',
      },
      app: {
        status: 'up',
        environment: process.env.NODE_ENV || 'development',
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
      },
    },
  };

  try {
    const client = getServerGrailClient();
    const response = await client.get('/health', { timeout: 5000 });
    const latencyMs = Date.now() - startTime;
    
    health.services.grailApi = {
      status: 'up',
      latencyMs,
    };
    
    if (response.data) {
      return NextResponse.json({
        ...health,
        grailHealth: response.data,
      });
    }
    
    return NextResponse.json(health);
  } catch (error: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    health.status = 'degraded';
    health.services.grailApi = {
      status: 'down',
      latencyMs,
      error: errorMessage,
    };
    
    console.error('Health check - Grail API unavailable:', errorMessage);
    
    return NextResponse.json(health, { status: 200 });
  }
}
