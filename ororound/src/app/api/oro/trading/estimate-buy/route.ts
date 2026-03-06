import { NextRequest, NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goldAmount = parseFloat(searchParams.get('goldAmount') || '0');

    if (goldAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid goldAmount' },
        { status: 400 }
      );
    }

    const estimate = await serverGrailApi.estimateBuy(goldAmount);
    return NextResponse.json({ success: true, data: estimate });
  } catch (error: any) {
    console.error('Estimate buy failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to estimate buy' },
      { status: error.response?.status || 500 }
    );
  }
}
