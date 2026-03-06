import { NextResponse } from 'next/server';
import { getServerGrailClient } from '@/lib/grail/server-client';

export async function GET() {
  try {
    const client = getServerGrailClient();
    const response = await client.get('/health');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { success: false, error: 'Health check failed' },
      { status: 500 }
    );
  }
}
