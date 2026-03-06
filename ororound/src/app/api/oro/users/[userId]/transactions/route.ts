import { NextRequest, NextResponse } from 'next/server';
import { getServerGrailClient } from '@/lib/grail/server-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const client = getServerGrailClient();
    
    const response = await client.get(`/api/users/${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      data: response.data.data.transactions || [] 
    });
  } catch (error: any) {
    console.error('Get transactions failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to get transactions' },
      { status: error.response?.status || 500 }
    );
  }
}
