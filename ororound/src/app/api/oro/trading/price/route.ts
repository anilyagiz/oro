import { NextResponse } from 'next/server';
import { serverGrailApi } from '@/lib/grail/server-client';

export async function GET() {
  try {
    const priceData = await serverGrailApi.getGoldPrice();
    return NextResponse.json({ success: true, data: priceData });
  } catch (error: any) {
    console.error('Get gold price failed:', error);
    return NextResponse.json(
      { success: false, error: error.response?.data?.error || 'Failed to get gold price' },
      { status: error.response?.status || 500 }
    );
  }
}
